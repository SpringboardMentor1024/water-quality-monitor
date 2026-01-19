"""
Seed script to populate demo data for NGO Collaborations, Projects, and Predictions
Run this after creating the database to populate with sample data
"""

from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models
import config

# Create engine and session
engine = create_engine(config.DATABASE_URL, connect_args={"check_same_thread": False})
Session = sessionmaker(bind=engine)

def seed_demo_data():
    """Populate database with demo data"""
    
    # Create all tables
    models.Base.metadata.create_all(bind=engine)
    db = Session()
    
    try:
        print("🌱 Seeding demo data...")
        
        # ============= SEED NGOs =============
        print("📍 Creating NGOs...")
        
        ngo1 = models.NGO(
            name="EcoWater Alliance",
            description="Focused on water quality monitoring and conservation in coastal regions",
            location="Mumbai, Maharashtra",
            contact_email="contact@ecowater.org",
            contact_phone="+91-22-XXXX-XXXX"
        )
        
        ngo2 = models.NGO(
            name="Groundwater India",
            description="Working on groundwater contamination studies and awareness",
            location="New Delhi, Delhi",
            contact_email="contact@groundwaterindia.org",
            contact_phone="+91-11-XXXX-XXXX"
        )
        
        ngo3 = models.NGO(
            name="Coastal Conservation Trust",
            description="Monitoring coastal water bodies and marine ecosystems",
            location="Bangalore, Karnataka",
            contact_email="contact@coastaltrust.org",
            contact_phone="+91-80-XXXX-XXXX"
        )
        
        ngo4 = models.NGO(
            name="River Guardians",
            description="Protecting river ecosystems and water quality",
            location="Ahmedabad, Gujarat",
            contact_email="contact@riverguardians.org",
            contact_phone="+91-79-XXXX-XXXX"
        )
        
        db.add_all([ngo1, ngo2, ngo3, ngo4])
        db.commit()
        print("✅ NGOs created successfully")
        
        # ============= SEED PROJECTS =============
        print("📊 Creating Projects...")
        
        project1 = models.Project(
            name="Community Water Quality Initiative - Riverbend",
            description="Monitoring water quality in the Riverbend area, focusing on industrial runoff and agricultural impact",
            status="Active",
            due_date=datetime.now() + timedelta(days=45)
        )
        
        project2 = models.Project(
            name="Groundwater Contamination Study - Northridge",
            description="Investigating lead and arsenic levels in local groundwater sources and informing residents",
            status="Active",
            due_date=datetime.now() + timedelta(days=60)
        )
        
        project3 = models.Project(
            name="Coastal Erosion & Water Quality - Seaville",
            description="Tracking coastal erosion patterns and their impact on water quality",
            status="Active",
            due_date=datetime.now() + timedelta(days=90)
        )
        
        project4 = models.Project(
            name="Rainwater Harvesting Initiative - Upland",
            description="Implementing rainwater harvesting systems for improved water supply and reduced runoff",
            status="Completed",
            due_date=datetime.now() - timedelta(days=30)
        )
        
        db.add_all([project1, project2, project3, project4])
        db.commit()
        print("✅ Projects created successfully")
        
        # ============= SEED COLLABORATIONS =============
        print("🤝 Creating Collaborations...")
        
        collab1 = models.Collaboration(
            project_id=project1.id,
            ngo_id=ngo1.id,
            start_date=datetime.now() - timedelta(days=30),
            end_date=datetime.now() + timedelta(days=45),
            contract_details="6-month monitoring contract with monthly reporting",
            status="Active"
        )
        
        collab2 = models.Collaboration(
            project_id=project2.id,
            ngo_id=ngo2.id,
            start_date=datetime.now() - timedelta(days=15),
            end_date=datetime.now() + timedelta(days=60),
            contract_details="Groundwater quality testing with lab analysis",
            status="Active"
        )
        
        collab3 = models.Collaboration(
            project_id=project3.id,
            ngo_id=ngo3.id,
            start_date=datetime.now() - timedelta(days=45),
            end_date=datetime.now() + timedelta(days=90),
            contract_details="Coastal monitoring with quarterly reports",
            status="Active"
        )
        
        collab4 = models.Collaboration(
            project_id=project4.id,
            ngo_id=ngo4.id,
            start_date=datetime.now() - timedelta(days=180),
            end_date=datetime.now() - timedelta(days=30),
            contract_details="Rainwater system implementation and monitoring",
            status="Completed"
        )
        
        db.add_all([collab1, collab2, collab3, collab4])
        db.commit()
        print("✅ Collaborations created successfully")
        
        # ============= SEED NGO-STATION ASSIGNMENTS =============
        print("📌 Assigning water stations to NGOs...")
        
        # Get existing water stations (assuming they exist from water quality seed)
        stations = db.query(models.WaterStation).limit(5).all()
        
        if stations:
            # Assign stations to NGOs
            assignments = [
                models.NGOStation(
                    ngo_id=ngo1.id,
                    project_id=project1.id,
                    station_id=stations[0].id,
                    assigned_date=datetime.now() - timedelta(days=30)
                ),
                models.NGOStation(
                    ngo_id=ngo1.id,
                    project_id=project1.id,
                    station_id=stations[1].id,
                    assigned_date=datetime.now() - timedelta(days=30)
                ),
                models.NGOStation(
                    ngo_id=ngo2.id,
                    project_id=project2.id,
                    station_id=stations[2].id,
                    assigned_date=datetime.now() - timedelta(days=15)
                ),
                models.NGOStation(
                    ngo_id=ngo3.id,
                    project_id=project3.id,
                    station_id=stations[3].id,
                    assigned_date=datetime.now() - timedelta(days=45)
                ),
                models.NGOStation(
                    ngo_id=ngo4.id,
                    project_id=project4.id,
                    station_id=stations[4].id,
                    assigned_date=datetime.now() - timedelta(days=180)
                )
            ]
            db.add_all(assignments)
            db.commit()
            print("✅ Water stations assigned to NGOs")
        else:
            print("⚠️  No water stations found. Skipping station assignments.")
        
        # ============= SEED STATION READINGS =============
        print("📊 Creating station readings...")
        
        if stations:
            readings = []
            # Create unique readings for each station with station-specific values
            station_params = {
                stations[0].id: {"ph_base": 7.1, "temp_base": 24.0, "do_base": 6.5, "turb_base": 4.2},
                stations[1].id: {"ph_base": 6.9, "temp_base": 23.5, "do_base": 6.8, "turb_base": 3.8},
                stations[2].id: {"ph_base": 7.3, "temp_base": 25.5, "do_base": 6.2, "turb_base": 5.2},
                stations[3].id: {"ph_base": 7.0, "temp_base": 22.8, "do_base": 7.0, "turb_base": 3.5},
                stations[4].id: {"ph_base": 7.4, "temp_base": 26.2, "do_base": 5.8, "turb_base": 6.1},
            }
            
            # Create 7 days of readings for each station
            for station in stations:
                if station.id in station_params:
                    params = station_params[station.id]
                    for day_offset in range(-6, 1):  # Last 7 days
                        reading_date = datetime.now() + timedelta(days=day_offset)
                        
                        # Add realistic variations
                        import random
                        random.seed(station.id + day_offset)  # Consistent per station/day
                        
                        readings.append(models.StationReading(
                            station_id=station.id,
                            parameter_name="pH",
                            value=round(params["ph_base"] + random.uniform(-0.3, 0.3), 2),
                            recorded_at=reading_date
                        ))
                        readings.append(models.StationReading(
                            station_id=station.id,
                            parameter_name="Temperature",
                            value=round(params["temp_base"] + random.uniform(-1.5, 1.5), 1),
                            recorded_at=reading_date
                        ))
                        readings.append(models.StationReading(
                            station_id=station.id,
                            parameter_name="DissolvedOxygen",
                            value=round(params["do_base"] + random.uniform(-0.5, 0.5), 2),
                            recorded_at=reading_date
                        ))
                        readings.append(models.StationReading(
                            station_id=station.id,
                            parameter_name="Turbidity",
                            value=round(params["turb_base"] + random.uniform(-0.8, 0.8), 2),
                            recorded_at=reading_date
                        ))
            
            db.add_all(readings)
            db.commit()
            print(f"✅ Created {len(readings)} station readings ({len(readings)//4} per station)")
        else:
            print("⚠️  No water stations found. Skipping readings creation.")
        
        # ============= SEED PREDICTIONS =============
        print("🔮 Creating predictive alerts...")
        
        if stations:
            predictions = [
                models.Prediction(
                    station_id=stations[0].id,
                    parameter=models.WaterParameter.pH,
                    current_value=7.2,
                    predicted_value=8.5,
                    probability=75.0,
                    expected_alert_date=datetime.now() + timedelta(days=3),
                    trend="Increasing",
                    risk_level="High",
                    review_content="pH levels showing concerning upward trend. Recommend immediate intervention.",
                    confidence_score=85.0
                ),
                models.Prediction(
                    station_id=stations[1].id,
                    parameter=models.WaterParameter.turbidity,
                    current_value=8.5,
                    predicted_value=12.0,
                    probability=65.0,
                    expected_alert_date=datetime.now() + timedelta(days=5),
                    trend="Increasing",
                    risk_level="Medium",
                    review_content="Turbidity increasing due to recent rainfall patterns.",
                    confidence_score=78.0
                ),
                models.Prediction(
                    station_id=stations[2].id,
                    parameter=models.WaterParameter.DO,
                    current_value=6.8,
                    predicted_value=4.5,
                    probability=55.0,
                    expected_alert_date=datetime.now() + timedelta(days=7),
                    trend="Decreasing",
                    risk_level="Medium",
                    review_content="Dissolved oxygen levels may drop below safe threshold.",
                    confidence_score=72.0
                ),
                models.Prediction(
                    station_id=stations[3].id,
                    parameter=models.WaterParameter.bacteria,
                    current_value=450.0,
                    predicted_value=800.0,
                    probability=80.0,
                    expected_alert_date=datetime.now() + timedelta(days=2),
                    trend="Increasing",
                    risk_level="High",
                    review_content="Bacterial contamination risk is critically high. Boil notice may be needed.",
                    confidence_score=88.0
                ),
                models.Prediction(
                    station_id=stations[4].id,
                    parameter=models.WaterParameter.temperature,
                    current_value=24.5,
                    predicted_value=28.0,
                    probability=40.0,
                    expected_alert_date=datetime.now() + timedelta(days=10),
                    trend="Increasing",
                    risk_level="Low",
                    review_content="Seasonal temperature increase. Normal variation.",
                    confidence_score=65.0
                )
            ]
            db.add_all(predictions)
            db.commit()
            print("✅ Predictive alerts created")
        
        print("\n✨ Demo data seeding complete!")
        print(f"  📍 {db.query(models.NGO).count()} NGOs created")
        print(f"  📊 {db.query(models.Project).count()} Projects created")
        print(f"  🤝 {db.query(models.Collaboration).count()} Collaborations created")
        print(f"  📌 {db.query(models.NGOStation).count()} Station assignments created")
        print(f"  � {db.query(models.StationReading).count()} Station readings created")
        print(f"  �🔮 {db.query(models.Prediction).count()} Predictions created")
        
    except Exception as e:
        print(f"❌ Error during seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
