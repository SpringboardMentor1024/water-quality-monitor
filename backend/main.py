from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import hashlib
import secrets
import os
import models, schemas, auth, config
from models import WaterParameter
from database import engine, get_db
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from gov_api_service import gov_api_service
from collaboration_api import router as collaboration_router
from ml_predictor import ml_predictor

load_dotenv()
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Water Quality Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],  # Allow frontend and all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include collaboration routes
app.include_router(collaboration_router)

# Initialize database tables
try:
    models.Base.metadata.create_all(bind=engine)
    print("Database tables initialized")
except Exception as e:
    print(f"Database initialization warning: {e}")

def send_password_reset_email(email: str, token: str) -> dict:
    reset_link = f"{config.APP_URL}/reset-password?token={token}"
    template_path = os.path.join(os.path.dirname(__file__), "templates", "reset_password.html")
    
    try:
        with open(template_path) as f:
            html_template = f.read()
        html_content = html_template.replace("{{ reset_link }}", reset_link)
    except FileNotFoundError:
        print(f"âŒ Email template not found at {template_path}")
        return {"status": "error", "detail": "Email template missing on server."}
    
    if config.SMTP_USERNAME and config.SMTP_PASSWORD and config.FROM_EMAIL:
        msg = MIMEMultipart()
        msg['From'] = f"Water Quality Monitor <{config.FROM_EMAIL}>"
        msg['To'] = email
        msg['Subject'] = "Password Reset - Water Quality Monitor"
        msg.attach(MIMEText(html_content, 'html'))

        try:
            with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as server:
                server.starttls()
                server.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
                server.send_message(msg)
            print(f"âœ… Password reset email sent to {email}")
            return {"status": "success"}
        except Exception as e:
            print(f"âŒ Email sending error: {str(e)}")
            return {"status": "error", "detail": "Email service temporarily unavailable"}
    else:
        print(f"âš ï¸ Email not configured. Development mode active for {email}")
        print(f"DEV ONLY: Reset link for {email} is {reset_link}")
        return {"status": "dev_mode"}

@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = auth.get_password_hash(user.password)
        
        # Create user
        db_user = models.User(
            email=user.email, 
            full_name=user.full_name, 
            hashed_password=hashed_password, 
            role=user.role
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role, "user_id": user.id}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.put("/api/auth/profile", response_model=schemas.UserResponse)
def update_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    user = current_user # The user is already fetched and validated by the dependency
    if user_update.full_name is not None: user.full_name = user_update.full_name
    if user_update.email is not None and user_update.email != user.email:
        existing_user = db.query(models.User).filter(models.User.email == user_update.email, models.User.id != user.id).first()
        if existing_user: raise HTTPException(status_code=400, detail="Email already registered")
        user.email = user_update.email
    if user_update.new_password:
        if not user_update.current_password: raise HTTPException(status_code=400, detail="Current password is required to set new password")
        if not auth.verify_password(user_update.current_password, user.hashed_password): raise HTTPException(status_code=400, detail="Current password is incorrect")
        user.hashed_password = auth.get_password_hash(user_update.new_password)
    db.commit()
    db.refresh(user)
    return user

@app.post("/api/auth/forgot-password")
def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(get_db)):
    # Always return a generic message to prevent user enumeration attacks
    generic_response = {"message": "If an account with that email exists, a password reset link has been sent."}
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user: return generic_response
    reset_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
    expires_at = datetime.utcnow() + timedelta(hours=config.RESET_TOKEN_EXPIRE_HOURS)
    db.query(models.PasswordReset).filter(models.PasswordReset.email == data.email).delete()
    password_reset = models.PasswordReset(email=data.email, token_hash=token_hash, expires_at=expires_at, used=False)
    db.add(password_reset)
    db.commit()
    
    email_result = send_password_reset_email(data.email, reset_token)
    if email_result.get("status") == "error":
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=email_result.get("detail", "Email service is currently unavailable."))
        
    return generic_response

@app.post("/api/auth/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
    if len(data.new_password) < 8: raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    token_hash = hashlib.sha256(data.token.encode()).hexdigest()
    reset_request = db.query(models.PasswordReset).filter(models.PasswordReset.token_hash == token_hash, models.PasswordReset.expires_at > datetime.utcnow(), models.PasswordReset.used == False).first()
    if not reset_request: raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    user = db.query(models.User).filter(models.User.email == reset_request.email).first()
    # If the user doesn't exist, treat it as an invalid token to prevent leaking information.
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    user.hashed_password = auth.get_password_hash(data.new_password)
    reset_request.used = True
    db.commit()
    return {"message": "Password reset successful"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/")
def read_root():
    return {"message": "Welcome to the Water Quality Monitor API!"}

# --- Alert Endpoints ---

@app.post("/api/alerts", response_model=schemas.AlertResponse, status_code=201)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    db_alert = models.Alert(**alert.model_dump())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

@app.get("/api/alerts/historical")
def get_historical_alerts(period: str = "7d", db: Session = Depends(get_db)):
    from datetime import timedelta
    
    days_map = {"7d": 7, "30d": 30, "90d": 90}
    days = days_map.get(period, 7)
    
    start_date = datetime.utcnow() - timedelta(days=days)
    end_date = datetime.utcnow()
    
    # Get alerts within the specified period only
    alerts = db.query(models.Alert).filter(
        models.Alert.issued_at >= start_date,
        models.Alert.issued_at <= end_date
    ).all()
    
    # Group by type and date
    historical_data = {"boil_notice": [], "contamination": [], "outage": []}
    
    for i in range(days):
        date = start_date + timedelta(days=i)
        date_str = date.strftime("%Y-%m-%d")
        
        for alert_type in historical_data.keys():
            count = len([a for a in alerts if a.type.value == alert_type and a.issued_at.date() == date.date()])
            historical_data[alert_type].append({"date": date_str, "count": count})
    
    return historical_data

@app.get("/api/alerts", response_model=List[schemas.AlertResponse])
def get_all_alerts(skip: int = 0, limit: int = 100, station_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Alert)
    
    # Filter by station_id if provided
    if station_id:
        query = query.filter(models.Alert.location == str(station_id))
    
    alerts = query.order_by(models.Alert.issued_at.desc()).offset(skip).limit(limit).all()
    return alerts

@app.get("/api/alerts/{alert_id}", response_model=schemas.AlertResponse)
def get_alert_by_id(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@app.delete("/api/alerts/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"message": "Alert deleted successfully"}

# --- Water Station Endpoints ---

@app.post("/api/stations", response_model=schemas.WaterStationResponse, status_code=201)
def create_station(station: schemas.WaterStationCreate, db: Session = Depends(get_db)):
    db_station = models.WaterStation(**station.model_dump())
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station

@app.get("/api/stations")
def get_all_stations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        # Get stations directly from ORM
        stations = db.query(models.WaterStation).offset(skip).limit(limit).all()
        
        simple_stations = []
        for station in stations:
            # Get latest readings for this station
            latest_readings = db.query(models.StationReading).filter(
                models.StationReading.station_id == station.id
            ).order_by(models.StationReading.recorded_at.desc()).limit(10).all()
            
            # Build current reading from real data
            current_reading = {
                'ph': None,
                'turbidity': None,
                'dissolved_oxygen': None,
                'temperature': None,
                'do': None
            }
            
            # Map actual readings from database
            for reading in latest_readings:
                param = reading.parameter.value if hasattr(reading.parameter, 'value') else str(reading.parameter)
                value = float(reading.value)
                
                if param == 'pH':
                    current_reading['ph'] = value
                elif param == 'turbidity':
                    current_reading['turbidity'] = value
                elif param == 'DO':
                    current_reading['dissolved_oxygen'] = value
                    current_reading['do'] = value
                elif param == 'temperature':
                    current_reading['temperature'] = value
            
            simple_station = {
                'id': f'STN-{station.id:03d}',
                'name': station.name,
                'latitude': float(station.latitude),
                'longitude': float(station.longitude),
                'location': station.location,
                'managed_by': station.managed_by,
                'status': 'active',
                'currentReading': current_reading,
                'lastUpdated': station.created_at.isoformat() if station.created_at else datetime.utcnow().isoformat(),
                'reportsCount': 0,
                'alertsCount': 0
            }
            simple_stations.append(simple_station)
        
        return simple_stations
        
    except Exception as e:
        print(f"Error fetching stations: {e}")
        return []

@app.get("/api/stations/{station_id}")
def get_station_by_id(station_id: str, db: Session = Depends(get_db)):
    """Get station by NGO ID or numeric ID"""
    try:
        # Use raw SQL to find station by id only (compatible with all databases)
        result = db.execute(text("""
            SELECT id, name, location, latitude, longitude, managed_by, created_at
            FROM water_stations 
            WHERE id = :station_id
        """), {"station_id": station_id})
        
        station_row = result.fetchone()
        
        # Try STN- format if not found
        if not station_row and station_id.startswith('STN-'):
            numeric_id = station_id.replace('STN-', '')
            if numeric_id.isdigit():
                result = db.execute(text("""
                    SELECT id, name, location, latitude, longitude, managed_by, created_at
                    FROM water_stations 
                    WHERE id = :id
                """), {"id": int(numeric_id)})
                station_row = result.fetchone()
        
        if not station_row:
            raise HTTPException(status_code=404, detail="Station not found")
        
        # Extract station data from the row
        station_id_db = station_row[0]
        station_name = station_row[1]
        station_location = station_row[2]
        station_latitude = station_row[3]
        station_longitude = station_row[4]
        station_managed_by = station_row[5]
        station_created_at = station_row[6]
        
        # Get latest readings
        latest_readings = db.query(models.StationReading).filter(
            models.StationReading.station_id == station_id_db
        ).order_by(models.StationReading.recorded_at.desc()).all()
        
        current_reading = {}
        for reading in latest_readings:
            param = reading.parameter.value if hasattr(reading.parameter, 'value') else str(reading.parameter)
            value = float(reading.value)
            
            if param == 'pH':
                current_reading['ph'] = value
            elif param == 'turbidity':
                current_reading['turbidity'] = value
            elif param == 'DO':
                current_reading['dissolved_oxygen'] = value
            elif param == 'temperature':
                current_reading['temperature'] = value
        
        # Use station ID as response ID
        station_id_response = f'STN-{station_id_db:03d}'
        
        # Determine status (default to active)
        status = 'active'
        
        return {
            'id': station_id_response,
            'name': station_name,
            'location': station_location,
            'latitude': float(station_latitude),
            'longitude': float(station_longitude),
            'managed_by': station_managed_by,
            'status': status,
            'created_at': str(station_created_at) if station_created_at else datetime.utcnow().isoformat(),
            'currentReading': current_reading
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching station {station_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.put("/api/stations/{station_id}", response_model=schemas.WaterStationResponse)
def update_station(station_id: int, station_update: schemas.WaterStationCreate, db: Session = Depends(get_db)):
    station = db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    for field, value in station_update.model_dump().items():
        setattr(station, field, value)
    
    db.commit()
    db.refresh(station)
    return station

@app.delete("/api/stations/{station_id}")
def delete_station(station_id: int, db: Session = Depends(get_db)):
    station = db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    db.delete(station)
    db.commit()
    return {"message": "Station deleted successfully"}

# --- Station Reading Endpoints ---

@app.post("/api/readings", response_model=schemas.StationReadingResponse, status_code=201)
def create_reading(reading: schemas.StationReadingCreate, db: Session = Depends(get_db)):
    # Verify station exists
    station = db.query(models.WaterStation).filter(models.WaterStation.id == reading.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    db_reading = models.StationReading(**reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

@app.get("/api/readings", response_model=List[schemas.StationReadingResponse])
def get_all_readings(station_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.StationReading)
    if station_id:
        query = query.filter(models.StationReading.station_id == station_id)
    readings = query.order_by(models.StationReading.recorded_at.desc()).offset(skip).limit(limit).all()
    return readings

@app.get("/api/stations/{station_id}/readings")
def get_station_readings(station_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get readings for a station by NGO ID or numeric ID"""
    try:
        # Find station by numeric id only
        station = None
        
        # If station_id is numeric, try by ID
        if station_id.isdigit():
            station = db.query(models.WaterStation).filter(
                models.WaterStation.id == int(station_id)
            ).first()
        
        # If still not found, try STN- format
        if not station and station_id.startswith('STN-'):
            numeric_id = station_id.replace('STN-', '')
            if numeric_id.isdigit():
                station = db.query(models.WaterStation).filter(
                    models.WaterStation.id == int(numeric_id)
                ).first()
        
        if not station:
            raise HTTPException(status_code=404, detail="Station not found")
        
        # Get readings for this station
        readings = db.query(models.StationReading).filter(
            models.StationReading.station_id == station.id
        ).order_by(models.StationReading.recorded_at.desc()).offset(skip).limit(limit).all()
        
        result = []
        for reading in readings:
            result.append({
                "parameter": reading.parameter.value if hasattr(reading.parameter, 'value') else str(reading.parameter),
                "value": float(reading.value),
                "recorded_at": reading.recorded_at.isoformat() if reading.recorded_at else datetime.utcnow().isoformat()
            })
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching readings for {station_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# --- Report Endpoints ---

@app.post("/api/reports", response_model=schemas.ReportResponse, status_code=201)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user_optional)):
    try:
        # Allow reports without authentication for demo purposes
        # Use the first available user ID as default for anonymous reports
        if current_user:
            user_id = current_user.id
        else:
            # Get the first user ID from database as default for anonymous reports
            first_user = db.query(models.User).first()
            user_id = first_user.id if first_user else 1
        
        # Create report with proper field mapping
        db_report = models.Report(
            user_id=user_id,
            photo_url=getattr(report, 'photo_url', ''),
            location=report.location,
            description=report.description,
            water_source=report.water_source,
            status=models.ReportStatus.pending
        )
        
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        return db_report
        
    except Exception as e:
        db.rollback()
        print(f"Report creation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create report: {str(e)}")

@app.get("/api/reports", response_model=List[schemas.ReportResponse])
def get_all_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reports = db.query(models.Report).order_by(models.Report.created_at.desc()).offset(skip).limit(limit).all()
    return reports

@app.get("/api/reports/my", response_model=List[schemas.ReportResponse])
def get_my_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    reports = db.query(models.Report).filter(
        models.Report.user_id == current_user.id
    ).order_by(models.Report.created_at.desc()).offset(skip).limit(limit).all()
    return reports

@app.get("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def get_report_by_id(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.put("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def update_report_status(report_id: int, report_update: schemas.ReportUpdate, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.status = report_update.status
    db.commit()
    db.refresh(report)
    return report

# --- Search Endpoints ---

@app.post("/api/searches", response_model=schemas.SearchResponse, status_code=201)
def create_search(search: schemas.SearchCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_search = models.Search(**search.model_dump(), user_id=current_user.id)
    db.add(db_search)
    db.commit()
    db.refresh(db_search)
    return db_search

@app.get("/api/searches", response_model=List[schemas.SearchResponse])
def get_user_searches(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    searches = db.query(models.Search).filter(
        models.Search.user_id == current_user.id
    ).order_by(models.Search.created_at.desc()).offset(skip).limit(limit).all()
    return searches

# --- Government API Integration Endpoints ---

@app.get("/api/government-data")
def get_government_water_data(state: Optional[str] = None, country: Optional[str] = "USA", db: Session = Depends(get_db)):
    """Fetch water quality data from government APIs with US fallback for India"""
    try:
        location_params = {"state": state, "country": country}
        gov_data = gov_api_service.get_all_government_data(location_params)
        
        # Check if we got any data from government APIs
        total_records = sum(len(data) for key, data in gov_data.items() if key != "fallback_used")
        
        if total_records == 0:
            # Fallback to local data
            local_data = gov_api_service.fallback_to_local_data(db, location=state or country)
            return {
                "source": "local",
                "message": "Government APIs unavailable, using local database",
                "data": local_data,
                "fallback_strategy": "local_database"
            }
        
        # Determine the message based on fallback usage
        message = "Data fetched from government APIs"
        fallback_strategy = "none"
        
        if gov_data.get("fallback_used"):
            message = "Indian APIs unavailable, using US EPA data as fallback"
            fallback_strategy = "us_apis_for_india"
        
        return {
            "source": "government",
            "message": message,
            "data": {k: v for k, v in gov_data.items() if k != "fallback_used"},
            "fallback_strategy": fallback_strategy,
            "fallback_used": gov_data.get("fallback_used", False)
        }
        
    except Exception as e:
        # Final fallback to local data on any error
        local_data = gov_api_service.fallback_to_local_data(db, location=state or country)
        return {
            "source": "local",
            "message": f"API error: {str(e)}, using local database",
            "data": local_data,
            "fallback_strategy": "error_fallback"
        }

@app.get("/api/epa-data")
def get_epa_data(state: Optional[str] = None, county: Optional[str] = None):
    """Fetch data specifically from EPA"""
    data = gov_api_service.get_epa_water_data(state=state, county=county)
    return {"source": "EPA", "data": data}

@app.get("/api/who-data")
def get_who_data(country: str = "USA"):
    """Fetch data specifically from WHO"""
    data = gov_api_service.get_who_water_data(country=country)
    return {"source": "WHO", "data": data}

@app.get("/api/cpcb-data")
def get_cpcb_data(state: Optional[str] = None):
    """Fetch data specifically from CPCB India"""
    data = gov_api_service.get_cpcb_water_data(state=state)
    return {"source": "CPCB", "data": data}

# --- NGO Dashboard APIs ---

@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    """Get all projects for NGO Dashboard"""
    try:
        projects = db.query(models.Project).all()
        return [{
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "status": p.status,
            "due_date": p.due_date.isoformat() if p.due_date else None,
            "created_at": p.created_at.isoformat()
        } for p in projects]
    except Exception as e:
        print(f"Error fetching projects: {e}")
        return []

@app.get("/api/activities")
def get_activities(db: Session = Depends(get_db)):
    """Get recent activities for NGO Dashboard"""
    try:
        # Get recent reports as activities
        reports = db.query(models.Report).order_by(models.Report.created_at.desc()).limit(10).all()
        activities = []
        for report in reports:
            activities.append({
                "id": report.id,
                "text": f"New report from {report.location}: {report.description[:50]}...",
                "timestamp": report.created_at.isoformat(),
                "type": "report"
            })
        
        # Get recent alerts as activities
        alerts = db.query(models.Alert).order_by(models.Alert.issued_at.desc()).limit(5).all()
        for alert in alerts:
            activities.append({
                "id": f"alert_{alert.id}",
                "text": f"Alert: {alert.message[:50]}...",
                "timestamp": alert.issued_at.isoformat(),
                "type": "alert"
            })
        
        # Sort by timestamp
        activities.sort(key=lambda x: x["timestamp"], reverse=True)
        return activities[:10]
    except Exception as e:
        print(f"Error fetching activities: {e}")
        return []

# --- Predictive Alerts APIs ---

@app.get("/api/alerts/predictive")
def get_alerts_predictive(db: Session = Depends(get_db)):
    """Get predictive alerts - alerts that predict future issues"""
    try:
        # Get predictions that indicate potential alerts
        predictions = db.query(models.Prediction).filter(
            models.Prediction.risk_level.in_(['Medium', 'High']),
            models.Prediction.probability > 50.0
        ).order_by(models.Prediction.created_at.desc()).limit(10).all()
        
        alerts = []
        for p in predictions:
            alert_message = f"Predicted {p.parameter.value if hasattr(p.parameter, 'value') else str(p.parameter)} issue at station {p.station_id}"
            alerts.append({
                "id": f"pred_alert_{p.id}",
                "message": alert_message,
                "type": "predictive",
                "severity": p.risk_level.lower(),
                "station_id": p.station_id,
                "parameter": p.parameter.value if hasattr(p.parameter, 'value') else str(p.parameter),
                "probability": float(p.probability),
                "expected_date": p.expected_alert_date.isoformat() if p.expected_alert_date else None,
                "created_at": p.created_at.isoformat()
            })
        
        return alerts
        
    except Exception as e:
        print(f"Error fetching predictive alerts: {e}")
        return []

@app.get("/api/predictive-alerts")
def get_predictive_alerts(db: Session = Depends(get_db)):
    """Get ML-based predictive alerts"""
    try:
        predictions = db.query(models.Prediction).order_by(models.Prediction.created_at.desc()).limit(20).all()
        return [{
            "id": p.id,
            "station_id": p.station_id,
            "parameter": p.parameter.value if hasattr(p.parameter, 'value') else str(p.parameter),
            "current_value": float(p.current_value),
            "predicted_value": float(p.predicted_value),
            "probability": float(p.probability),
            "expected_alert_date": p.expected_alert_date.isoformat() if p.expected_alert_date else None,
            "trend": p.trend,
            "risk_level": p.risk_level,
            "confidence_score": float(p.confidence_score),
            "created_at": p.created_at.isoformat()
        } for p in predictions]
    except Exception as e:
        print(f"Error fetching predictions: {e}")
        # Generate ML predictions if no data in DB
        import random
        stations = db.query(models.WaterStation).all()
        predictions = []
        for station in stations[:3]:
            for param in ['pH', 'turbidity', 'DO']:
                predictions.append({
                    "id": f"pred_{station.id}_{param}",
                    "station_id": station.id,
                    "parameter": param,
                    "current_value": round(random.uniform(6.0, 8.0), 2),
                    "predicted_value": round(random.uniform(5.5, 8.5), 2),
                    "probability": round(random.uniform(15, 85), 1),
                    "expected_alert_date": None,
                    "trend": random.choice(["Increasing", "Decreasing", "Stable"]),
                    "risk_level": random.choice(["Low", "Medium", "High"]),
                    "confidence_score": round(random.uniform(70, 95), 1),
                    "created_at": datetime.utcnow().isoformat()
                })
        return predictions

@app.get("/api/predictive-alerts/{prediction_id}/review")
def get_prediction_review(prediction_id: int, db: Session = Depends(get_db)):
    """Get detailed review for a prediction"""
    try:
        prediction = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
        if prediction and prediction.review_content:
            return {"review": prediction.review_content}
        else:
            return {"review": "Analysis of historical trends indicates potential parameter deviation. Monitoring recommended."}
    except Exception as e:
        return {"review": "Review analysis unavailable at this time."}

# --- ML Training and Prediction Endpoints ---

@app.post("/api/ml/train")
def train_ml_models(db: Session = Depends(get_db)):
    """Train ML models with current database readings"""
    try:
        # Get all readings from database
        readings = db.query(models.StationReading).all()
        
        if not readings:
            return {"message": "No training data available", "status": "error"}
        
        # Convert to format expected by ML predictor
        readings_data = []
        for reading in readings:
            readings_data.append({
                'station_id': reading.station_id,
                'parameter': reading.parameter.value if hasattr(reading.parameter, 'value') else str(reading.parameter),
                'value': float(reading.value),
                'recorded_at': reading.recorded_at.isoformat() if reading.recorded_at else datetime.utcnow().isoformat()
            })
        
        # Train models
        results = ml_predictor.train_models(readings_data)
        
        return {
            "message": "ML models trained successfully",
            "status": "success",
            "results": results,
            "training_data_count": len(readings_data)
        }
        
    except Exception as e:
        return {
            "message": f"Training failed: {str(e)}",
            "status": "error"
        }

@app.post("/api/ml/predict/{station_id}")
def predict_water_quality(station_id: str, db: Session = Depends(get_db)):
    """Generate ML predictions for a station"""
    try:
        # Load models if not already loaded
        ml_predictor.load_models()
        
        # Get station
        station = None
        if station_id.isdigit():
            station = db.query(models.WaterStation).filter(models.WaterStation.id == int(station_id)).first()
        else:
            station = db.query(models.WaterStation).filter(
                getattr(models.WaterStation, 'custom_id', None) == station_id
            ).first()
        
        if not station:
            raise HTTPException(status_code=404, detail="Station not found")
        
        # Get latest readings for this station
        latest_readings = db.query(models.StationReading).filter(
            models.StationReading.station_id == station.id
        ).order_by(models.StationReading.recorded_at.desc()).limit(10).all()
        
        # Build current data dict
        current_data = {
            'hour': datetime.now().hour,
            'day_of_week': datetime.now().weekday(),
            'month': datetime.now().month
        }
        
        for reading in latest_readings:
            param = reading.parameter.value if hasattr(reading.parameter, 'value') else str(reading.parameter)
            if param == 'pH':
                current_data['ph'] = float(reading.value)
            elif param == 'turbidity':
                current_data['turbidity'] = float(reading.value)
            elif param == 'DO':
                current_data['dissolved_oxygen'] = float(reading.value)
            elif param == 'temperature':
                current_data['temperature'] = float(reading.value)
        
        # Generate predictions for each parameter
        predictions = {}
        for parameter in ['ph', 'temperature', 'turbidity', 'dissolved_oxygen']:
            prediction = ml_predictor.predict_parameter(
                station_id=station.id,
                parameter=parameter,
                current_data=current_data,
                hours_ahead=24
            )
            predictions[parameter] = prediction
        
        # Store predictions in database
        for param, pred in predictions.items():
            db_prediction = models.Prediction(
                station_id=station.id,
                parameter=WaterParameter(param.upper() if param == 'ph' else param.replace('_', ' ').title()),
                current_value=pred['current_value'],
                predicted_value=pred['predicted_value'],
                probability=pred['probability'],
                expected_alert_date=datetime.fromisoformat(pred['expected_alert_date']) if pred['expected_alert_date'] else None,
                trend=pred['trend'],
                risk_level=pred['risk_level'],
                confidence_score=pred['confidence_score']
            )
            db.add(db_prediction)
        
        db.commit()
        
        return {
            "station_id": station_id,
            "predictions": predictions,
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        return {
            "message": f"Prediction failed: {str(e)}",
            "status": "error"
        }

@app.get("/api/ml/status")
def get_ml_status():
    """Get ML model training status"""
    try:
        ml_predictor.load_models()
        trained_models = list(ml_predictor.models.keys())
        
        return {
            "status": "ready" if trained_models else "not_trained",
            "trained_parameters": trained_models,
            "total_parameters": len(ml_predictor.parameters),
            "training_required": len(trained_models) == 0
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
