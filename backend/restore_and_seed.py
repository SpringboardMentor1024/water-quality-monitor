#!/usr/bin/env python3
"""
Restore alerts and seed NGO collaboration data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import engine
import models
from datetime import datetime, timedelta
import random

def restore_alerts_data():
    """Restore proper alerts data"""
    db = Session(bind=engine)
    
    try:
        # Clear existing alerts
        db.query(models.Alert).delete()
        
        # Create diverse alerts for the last 30 days
        alert_data = []
        base_date = datetime.utcnow() - timedelta(days=30)
        
        locations = [
            "Downtown Treatment Plant", "River Delta Station", "Lake Reservoir Monitor",
            "Industrial Zone Station", "Residential Area Monitor", "Coastal Watch Point",
            "Mountain Spring Station", "Urban Center Monitor", "Suburban District Station"
        ]
        
        alert_types = [
            ("boil_notice", [
                "Boil water advisory issued due to bacterial contamination",
                "Precautionary boil water notice for maintenance work", 
                "Boil water alert - water main break detected",
                "Emergency boil water notice - system pressure loss"
            ]),
            ("contamination", [
                "High lead levels detected in water supply",
                "Chemical contamination reported in water source",
                "Bacterial contamination exceeds safe limits",
                "Industrial discharge detected upstream",
                "Pesticide residues found above threshold"
            ]),
            ("outage", [
                "Water service interruption due to pump failure",
                "Scheduled maintenance causing water outage", 
                "Emergency water service disruption",
                "Power outage affecting water treatment",
                "Pipeline repair causing service interruption"
            ])
        ]
        
        # Generate 25-30 alerts over 30 days
        for day in range(30):
            current_date = base_date + timedelta(days=day)
            
            # Random number of alerts per day (0-2)
            num_alerts = random.randint(0, 2)
            
            for _ in range(num_alerts):
                alert_type, messages = random.choice(alert_types)
                message = random.choice(messages)
                location = random.choice(locations)
                
                alert_time = current_date + timedelta(
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59)
                )
                
                alert_data.append({
                    "type": alert_type,
                    "message": message,
                    "location": location,
                    "issued_at": alert_time
                })
        
        # Add alerts to database
        for alert_info in alert_data:
            alert = models.Alert(**alert_info)
            db.add(alert)
        
        db.commit()
        print(f"Restored {len(alert_data)} alerts")
        
    except Exception as e:
        print(f"Error restoring alerts: {e}")
        db.rollback()
    finally:
        db.close()

def seed_ngo_data():
    """Seed NGO collaboration data"""
    db = Session(bind=engine)
    
    try:
        # Create NGOs
        ngos_data = [
            {
                "name": "Clean Water Initiative",
                "description": "Dedicated to ensuring clean water access for all communities",
                "location": "Mumbai, India",
                "contact_email": "info@cleanwater.org",
                "contact_phone": "+91-9876543210"
            },
            {
                "name": "Water Conservation Society", 
                "description": "Focused on water conservation and quality monitoring",
                "location": "Delhi, India",
                "contact_email": "contact@waterconservation.org",
                "contact_phone": "+91-9876543211"
            },
            {
                "name": "Aqua Guard Foundation",
                "description": "Protecting water resources through community engagement",
                "location": "Bangalore, India", 
                "contact_email": "hello@aquaguard.org",
                "contact_phone": "+91-9876543212"
            }
        ]
        
        ngo_objects = []
        for ngo_data in ngos_data:
            existing = db.query(models.NGO).filter(models.NGO.name == ngo_data["name"]).first()
            if not existing:
                ngo = models.NGO(**ngo_data)
                db.add(ngo)
                ngo_objects.append(ngo)
        
        # Create Projects
        projects_data = [
            {
                "name": "Urban Water Quality Monitoring",
                "description": "Comprehensive monitoring of urban water sources",
                "status": "Active",
                "due_date": datetime.utcnow() + timedelta(days=180)
            },
            {
                "name": "Rural Water Access Initiative", 
                "description": "Improving water access in rural communities",
                "status": "Active",
                "due_date": datetime.utcnow() + timedelta(days=365)
            },
            {
                "name": "Industrial Pollution Control",
                "description": "Monitoring and controlling industrial water pollution",
                "status": "Active", 
                "due_date": datetime.utcnow() + timedelta(days=270)
            }
        ]
        
        project_objects = []
        for project_data in projects_data:
            existing = db.query(models.Project).filter(models.Project.name == project_data["name"]).first()
            if not existing:
                project = models.Project(**project_data)
                db.add(project)
                project_objects.append(project)
        
        db.commit()
        db.refresh_all()
        
        # Create Collaborations
        if ngo_objects and project_objects:
            for i, ngo in enumerate(ngo_objects):
                if i < len(project_objects):
                    collaboration = models.Collaboration(
                        project_id=project_objects[i].id,
                        ngo_id=ngo.id,
                        start_date=datetime.utcnow() - timedelta(days=30),
                        end_date=datetime.utcnow() + timedelta(days=300),
                        contract_details=f"Monitoring contract for {project_objects[i].name}",
                        status="Active"
                    )
                    db.add(collaboration)
        
        # Create some predictions for ML model
        stations = db.query(models.WaterStation).all()
        for station in stations[:3]:
            for param in ['pH', 'turbidity', 'DO']:
                prediction = models.Prediction(
                    station_id=station.id,
                    parameter=param,
                    current_value=round(random.uniform(6.0, 8.0), 2),
                    predicted_value=round(random.uniform(5.5, 8.5), 2), 
                    probability=round(random.uniform(15, 85), 1),
                    trend=random.choice(["Increasing", "Decreasing", "Stable"]),
                    risk_level=random.choice(["Low", "Medium", "High"]),
                    confidence_score=round(random.uniform(70, 95), 1),
                    review_content="ML analysis indicates potential parameter deviation based on historical trends."
                )
                db.add(prediction)
        
        db.commit()
        print("NGO collaboration data seeded successfully")
        
    except Exception as e:
        print(f"Error seeding NGO data: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("Restoring alerts and seeding NGO data...")
    restore_alerts_data()
    seed_ngo_data()
    print("Data restoration complete!")

if __name__ == "__main__":
    main()