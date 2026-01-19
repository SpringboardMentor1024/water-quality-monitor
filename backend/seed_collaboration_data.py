#!/usr/bin/env python3
"""
Seed Collaboration Data
This script populates the database with sample NGOs, projects, collaborations, and predictions
Run after initializing tables
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import sys

def seed_collaboration_data():
    """Seed sample data for testing"""
    db = SessionLocal()
    
    try:
        print("🌱 Seeding collaboration data...")
        
        # Check if data already exists
        existing_ngos = db.query(models.NGO).count()
        if existing_ngos > 0:
            print("⚠️ Sample data already exists. Skipping seed...")
            return True
        
        # ============== CREATE NGOs ==============
        print("\n📋 Creating NGOs...")
        ngo1 = models.NGO(
            name="Water for All Foundation",
            email="contact@waterforall.org",
            phone="+91-9876543210",
            location="Mumbai, Maharashtra",
            established_date=datetime(2015, 1, 15),
            description="Leading water quality monitoring NGO in Western India",
            website="https://www.waterforall.org"
        )
        
        ngo2 = models.NGO(
            name="Clean Water Initiative",
            email="info@cleanwater.org",
            phone="+91-9876543211",
            location="New Delhi",
            established_date=datetime(2018, 6, 20),
            description="Dedicated to ensuring clean water access across India",
            website="https://www.cleanwater.org"
        )
        
        ngo3 = models.NGO(
            name="Aqua Conservation Trust",
            email="hello@aquaconservation.org",
            phone="+91-9876543212",
            location="Bangalore, Karnataka",
            established_date=datetime(2016, 3, 10),
            description="Water conservation and monitoring organization",
            website="https://www.aquaconservation.org"
        )
        
        db.add_all([ngo1, ngo2, ngo3])
        db.commit()
        db.refresh(ngo1)
        db.refresh(ngo2)
        db.refresh(ngo3)
        print(f"✅ Created 3 NGOs")
        
        # ============== CREATE PROJECTS ==============
        print("\n📋 Creating Projects...")
        project1 = models.Project(
            name="National Water Quality Assessment 2026",
            description="Comprehensive water quality monitoring across major water bodies in India",
            status="active",
            start_date=datetime(2026, 1, 1),
            end_date=datetime(2026, 12, 31),
            budget=5000000.00
        )
        
        project2 = models.Project(
            name="Ganges River Conservation Initiative",
            description="Special monitoring and conservation project for Ganges river",
            status="active",
            start_date=datetime(2026, 1, 1),
            end_date=datetime(2027, 6, 30),
            budget=3000000.00
        )
        
        db.add_all([project1, project2])
        db.commit()
        db.refresh(project1)
        db.refresh(project2)
        print(f"✅ Created 2 Projects")
        
        # ============== CREATE COLLABORATIONS ==============
        print("\n📋 Creating Collaborations...")
        collab1 = models.Collaboration(
            ngo1_id=ngo1.id,
            ngo2_id=ngo2.id,
            project_id=project1.id,
            status="active",
            start_date=datetime(2026, 1, 1),
            end_date=datetime(2026, 12, 31),
            agreement_details="Partnership for comprehensive water quality monitoring across western and northern India"
        )
        
        collab2 = models.Collaboration(
            ngo1_id=ngo2.id,
            ngo2_id=ngo3.id,
            project_id=project2.id,
            status="active",
            start_date=datetime(2026, 1, 1),
            end_date=datetime(2027, 6, 30),
            agreement_details="Collaborative effort for Ganges river conservation and monitoring"
        )
        
        db.add_all([collab1, collab2])
        db.commit()
        print(f"✅ Created 2 Collaborations")
        
        # ============== ASSIGN NGOs TO PROJECTS ==============
        print("\n📋 Assigning NGOs to Projects...")
        assignment1 = models.ProjectNGOAssignment(
            project_id=project1.id,
            ngo_id=ngo1.id,
            assigned_date=datetime.now(),
            contract_period_start=datetime(2026, 1, 1),
            contract_period_end=datetime(2026, 12, 31)
        )
        
        assignment2 = models.ProjectNGOAssignment(
            project_id=project1.id,
            ngo_id=ngo2.id,
            assigned_date=datetime.now(),
            contract_period_start=datetime(2026, 1, 1),
            contract_period_end=datetime(2026, 12, 31)
        )
        
        assignment3 = models.ProjectNGOAssignment(
            project_id=project2.id,
            ngo_id=ngo2.id,
            assigned_date=datetime.now(),
            contract_period_start=datetime(2026, 1, 1),
            contract_period_end=datetime(2027, 6, 30)
        )
        
        assignment4 = models.ProjectNGOAssignment(
            project_id=project2.id,
            ngo_id=ngo3.id,
            assigned_date=datetime.now(),
            contract_period_start=datetime(2026, 1, 1),
            contract_period_end=datetime(2027, 6, 30)
        )
        
        db.add_all([assignment1, assignment2, assignment3, assignment4])
        db.commit()
        print(f"✅ Assigned NGOs to Projects")
        
        # ============== ASSIGN STATIONS TO PROJECTS ==============
        print("\n📋 Assigning Stations to Projects...")
        stations = db.query(models.WaterStation).limit(8).all()
        
        if stations:
            # Assign first 4 stations to project 1
            for i, station in enumerate(stations[:4]):
                assignment = models.ProjectStationAssignment(
                    project_id=project1.id,
                    station_id=station.id,
                    assigned_date=datetime.now(),
                    assignment_period_start=datetime(2026, 1, 1),
                    assignment_period_end=datetime(2026, 12, 31)
                )
                db.add(assignment)
            
            # Assign remaining stations to project 2
            for station in stations[4:]:
                assignment = models.ProjectStationAssignment(
                    project_id=project2.id,
                    station_id=station.id,
                    assigned_date=datetime.now(),
                    assignment_period_start=datetime(2026, 1, 1),
                    assignment_period_end=datetime(2027, 6, 30)
                )
                db.add(assignment)
            
            db.commit()
            print(f"✅ Assigned {len(stations)} Stations to Projects")
        else:
            print("⚠️ No stations found - please run populate_sample_stations.py first")
        
        # ============== CREATE PREDICTIONS ==============
        print("\n📋 Creating Predictions...")
        predictions_data = [
            {
                "station_id": stations[0].id if stations else 1,
                "parameter": models.WaterParameter.turbidity,
                "current_value": 13.0,
                "predicted_value": 14.8,
                "probability": 75.00,
                "expected_alert_date": datetime.now() + timedelta(days=2),
                "trend": "Increasing",
                "risk_level": "High",
                "review_content": "Turbidity levels showing increasing trend. Current 13 NTU, predicted 14.8 NTU. Threshold is 10 NTU."
            },
            {
                "station_id": stations[1].id if len(stations) > 1 else 2,
                "parameter": models.WaterParameter.bacteria,
                "current_value": 280.0,
                "predicted_value": 320.0,
                "probability": 65.00,
                "expected_alert_date": datetime.now() + timedelta(days=7),
                "trend": "Increasing",
                "risk_level": "High",
                "review_content": "Bacterial contamination rising. Current 280 CFU/mL, predicted 320 CFU/mL."
            },
            {
                "station_id": stations[2].id if len(stations) > 2 else 3,
                "parameter": models.WaterParameter.DO,
                "current_value": 4.9,
                "predicted_value": 4.7,
                "probability": 45.00,
                "expected_alert_date": datetime.now() + timedelta(days=14),
                "trend": "Decreasing",
                "risk_level": "Medium",
                "review_content": "Dissolved oxygen levels declining. Current 4.9 mg/L, predicted 4.7 mg/L. Safe limit is 5.0 mg/L."
            },
            {
                "station_id": stations[3].id if len(stations) > 3 else 4,
                "parameter": models.WaterParameter.pH,
                "current_value": 8.8,
                "predicted_value": 8.9,
                "probability": 35.00,
                "expected_alert_date": datetime.now() + timedelta(days=28),
                "trend": "Increasing",
                "risk_level": "Low",
                "review_content": "pH moving towards alkalinity. Current 8.8, predicted 8.9. Safe range is 6.5-8.5."
            }
        ]
        
        for pred_data in predictions_data:
            prediction = models.Prediction(**pred_data)
            db.add(prediction)
        
        db.commit()
        print(f"✅ Created {len(predictions_data)} Predictions")
        
        # ============== SUMMARY ==============
        print("\n" + "="*50)
        print("✅ SAMPLE DATA SEEDING COMPLETE!")
        print("="*50)
        print("\nCreated:")
        print(f"  • {db.query(models.NGO).count()} NGOs")
        print(f"  • {db.query(models.Project).count()} Projects")
        print(f"  • {db.query(models.Collaboration).count()} Collaborations")
        print(f"  • {db.query(models.ProjectNGOAssignment).count()} NGO Assignments")
        print(f"  • {db.query(models.ProjectStationAssignment).count()} Station Assignments")
        print(f"  • {db.query(models.Prediction).count()} Predictions")
        
        print("\n📚 Test the API:")
        print("  • Visit: http://localhost:8000/docs")
        print("  • Try: GET /api/ngos")
        print("  • Try: GET /api/projects")
        print("  • Try: GET /api/predictions")
        
        return True
        
    except Exception as e:
        print(f"❌ Error seeding data: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False
        
    finally:
        db.close()

if __name__ == "__main__":
    success = seed_collaboration_data()
    sys.exit(0 if success else 1)
