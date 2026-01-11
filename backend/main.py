from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
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
def get_all_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).order_by(models.Alert.issued_at.desc()).offset(skip).limit(limit).all()
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
        stations = db.query(models.WaterStation).offset(skip).limit(limit).all()
        
        # Simple station response without complex readings
        simple_stations = []
        for station in stations:
            simple_station = {
                'id': f'STN-{station.id:03d}',
                'name': station.name,
                'latitude': float(station.latitude),
                'longitude': float(station.longitude),
                'location': station.location,
                'managed_by': station.managed_by,
                'status': 'active',
                'currentReading': {
                    'ph': 7.2,
                    'turbidity': 1.5,
                    'dissolved_oxygen': 8.0,
                    'temperature': 22.0
                },
                'lastUpdated': station.created_at.isoformat(),
                'reportsCount': 0,
                'alertsCount': 0
            }
            simple_stations.append(simple_station)
        
        return simple_stations
        
    except Exception as e:
        print(f"Error fetching stations: {e}")
        return []

@app.get("/api/stations/{station_id}", response_model=schemas.WaterStationResponse)
def get_station_by_id(station_id: int, db: Session = Depends(get_db)):
    station = db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station

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

@app.get("/api/stations/{station_id}/readings", response_model=List[schemas.StationReadingResponse])
def get_station_readings(station_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    station = db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    readings = db.query(models.StationReading).filter(
        models.StationReading.station_id == station_id
    ).order_by(models.StationReading.recorded_at.desc()).offset(skip).limit(limit).all()
    return readings

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
