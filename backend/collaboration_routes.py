# Backend API Routes for NGO Collaborations, Projects, and Predictions
# Add these endpoints to your main.py file

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import models, schemas
from database import get_db
import schemas_collaboration as collab_schemas

router = APIRouter()

# ============== NGO CRUD ENDPOINTS ==============

@router.post("/api/ngos", response_model=collab_schemas.NGOResponse, status_code=201)
def create_ngo(ngo: collab_schemas.NGOCreate, db: Session = Depends(get_db)):
    """Create a new NGO"""
    db_ngo = db.query(models.NGO).filter(models.NGO.name == ngo.name).first()
    if db_ngo:
        raise HTTPException(status_code=400, detail="NGO with this name already exists")
    
    db_ngo = models.NGO(**ngo.model_dump())
    db.add(db_ngo)
    db.commit()
    db.refresh(db_ngo)
    return db_ngo

@router.get("/api/ngos", response_model=List[collab_schemas.NGOResponse])
def get_all_ngos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all NGOs"""
    ngos = db.query(models.NGO).offset(skip).limit(limit).all()
    return ngos

@router.get("/api/ngos/{ngo_id}", response_model=collab_schemas.NGOWithProjects)
def get_ngo_by_id(ngo_id: int, db: Session = Depends(get_db)):
    """Get NGO details with projects and stations"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo

@router.put("/api/ngos/{ngo_id}", response_model=collab_schemas.NGOResponse)
def update_ngo(ngo_id: int, ngo_update: collab_schemas.NGOUpdate, db: Session = Depends(get_db)):
    """Update NGO details"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    update_data = ngo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ngo, key, value)
    
    db.commit()
    db.refresh(ngo)
    return ngo

@router.delete("/api/ngos/{ngo_id}", status_code=204)
def delete_ngo(ngo_id: int, db: Session = Depends(get_db)):
    """Delete an NGO"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    db.delete(ngo)
    db.commit()

@router.get("/api/ngos/{ngo_id}/projects", response_model=List[collab_schemas.ProjectResponse])
def get_ngo_projects(ngo_id: int, db: Session = Depends(get_db)):
    """Get all projects for an NGO"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo.projects

@router.get("/api/ngos/{ngo_id}/stations", response_model=List[schemas.WaterStationResponse])
def get_ngo_stations(ngo_id: int, db: Session = Depends(get_db)):
    """Get all stations assigned to an NGO"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo.stations

@router.get("/api/ngos/{ngo_id}/collaborations", response_model=List[collab_schemas.CollaborationResponse])
def get_ngo_collaborations(ngo_id: int, db: Session = Depends(get_db)):
    """Get all collaborations for an NGO"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    collaborations = db.query(models.Collaboration).filter(
        (models.Collaboration.ngo1_id == ngo_id) | (models.Collaboration.ngo2_id == ngo_id)
    ).all()
    return collaborations


# ============== PROJECT CRUD ENDPOINTS ==============

@router.post("/api/projects", response_model=collab_schemas.ProjectResponse, status_code=201)
def create_project(project: collab_schemas.ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project"""
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/api/projects", response_model=List[collab_schemas.ProjectResponse])
def get_all_projects(skip: int = 0, limit: int = 100, status_filter: str = None, db: Session = Depends(get_db)):
    """Get all projects with optional status filter"""
    query = db.query(models.Project)
    if status_filter:
        query = query.filter(models.Project.status == status_filter)
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.get("/api/projects/{project_id}", response_model=collab_schemas.ProjectWithDetails)
def get_project_by_id(project_id: int, db: Session = Depends(get_db)):
    """Get project details with NGOs and stations"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/api/projects/{project_id}", response_model=collab_schemas.ProjectResponse)
def update_project(project_id: int, project_update: collab_schemas.ProjectUpdate, db: Session = Depends(get_db)):
    """Update project details"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/api/projects/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()

@router.get("/api/projects/{project_id}/stations", response_model=List[schemas.WaterStationResponse])
def get_project_stations(project_id: int, db: Session = Depends(get_db)):
    """Get all stations in a project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.stations


# ============== PROJECT-NGO ASSIGNMENT ENDPOINTS ==============

@router.post("/api/projects/{project_id}/assign-ngo", response_model=collab_schemas.ProjectNGOAssignmentResponse, status_code=201)
def assign_ngo_to_project(project_id: int, assignment: collab_schemas.ProjectNGOAssignmentCreate, db: Session = Depends(get_db)):
    """Assign an NGO to a project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    ngo = db.query(models.NGO).filter(models.NGO.id == assignment.ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    existing = db.query(models.ProjectNGOAssignment).filter(
        models.ProjectNGOAssignment.project_id == project_id,
        models.ProjectNGOAssignment.ngo_id == assignment.ngo_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="NGO already assigned to this project")
    
    db_assignment = models.ProjectNGOAssignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.delete("/api/projects/{project_id}/ngos/{ngo_id}", status_code=204)
def remove_ngo_from_project(project_id: int, ngo_id: int, db: Session = Depends(get_db)):
    """Remove NGO from project"""
    assignment = db.query(models.ProjectNGOAssignment).filter(
        models.ProjectNGOAssignment.project_id == project_id,
        models.ProjectNGOAssignment.ngo_id == ngo_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assignment)
    db.commit()


# ============== PROJECT-STATION ASSIGNMENT ENDPOINTS ==============

@router.post("/api/projects/{project_id}/assign-station", response_model=collab_schemas.ProjectStationAssignmentResponse, status_code=201)
def assign_station_to_project(project_id: int, assignment: collab_schemas.ProjectStationAssignmentCreate, db: Session = Depends(get_db)):
    """Assign a station to a project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    station = db.query(models.WaterStation).filter(models.WaterStation.id == assignment.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    existing = db.query(models.ProjectStationAssignment).filter(
        models.ProjectStationAssignment.project_id == project_id,
        models.ProjectStationAssignment.station_id == assignment.station_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Station already assigned to this project")
    
    db_assignment = models.ProjectStationAssignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.delete("/api/projects/{project_id}/stations/{station_id}", status_code=204)
def remove_station_from_project(project_id: int, station_id: int, db: Session = Depends(get_db)):
    """Remove station from project"""
    assignment = db.query(models.ProjectStationAssignment).filter(
        models.ProjectStationAssignment.project_id == project_id,
        models.ProjectStationAssignment.station_id == station_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assignment)
    db.commit()


# ============== COLLABORATION CRUD ENDPOINTS ==============

@router.post("/api/collaborations", response_model=collab_schemas.CollaborationResponse, status_code=201)
def create_collaboration(collab: collab_schemas.CollaborationCreate, db: Session = Depends(get_db)):
    """Create a collaboration between two NGOs"""
    if collab.ngo1_id == collab.ngo2_id:
        raise HTTPException(status_code=400, detail="Cannot collaborate with itself")
    
    ngo1 = db.query(models.NGO).filter(models.NGO.id == collab.ngo1_id).first()
    ngo2 = db.query(models.NGO).filter(models.NGO.id == collab.ngo2_id).first()
    
    if not ngo1 or not ngo2:
        raise HTTPException(status_code=404, detail="One or both NGOs not found")
    
    db_collab = models.Collaboration(**collab.model_dump())
    db.add(db_collab)
    db.commit()
    db.refresh(db_collab)
    return db_collab

@router.get("/api/collaborations", response_model=List[collab_schemas.CollaborationResponse])
def get_all_collaborations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all collaborations"""
    collaborations = db.query(models.Collaboration).offset(skip).limit(limit).all()
    return collaborations

@router.get("/api/collaborations/{collab_id}", response_model=collab_schemas.CollaborationWithDetails)
def get_collaboration_by_id(collab_id: int, db: Session = Depends(get_db)):
    """Get collaboration details"""
    collab = db.query(models.Collaboration).filter(models.Collaboration.id == collab_id).first()
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    return collab

@router.put("/api/collaborations/{collab_id}", response_model=collab_schemas.CollaborationResponse)
def update_collaboration(collab_id: int, collab_update: collab_schemas.CollaborationUpdate, db: Session = Depends(get_db)):
    """Update collaboration details"""
    collab = db.query(models.Collaboration).filter(models.Collaboration.id == collab_id).first()
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    update_data = collab_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(collab, key, value)
    
    db.commit()
    db.refresh(collab)
    return collab

@router.delete("/api/collaborations/{collab_id}", status_code=204)
def delete_collaboration(collab_id: int, db: Session = Depends(get_db)):
    """Delete a collaboration"""
    collab = db.query(models.Collaboration).filter(models.Collaboration.id == collab_id).first()
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    db.delete(collab)
    db.commit()


# ============== PREDICTION ENDPOINTS ==============

@router.post("/api/predictions", response_model=collab_schemas.PredictionResponse, status_code=201)
def create_prediction(prediction: collab_schemas.PredictionCreate, db: Session = Depends(get_db)):
    """Create a prediction"""
    station = db.query(models.WaterStation).filter(models.WaterStation.id == prediction.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    db_prediction = models.Prediction(**prediction.model_dump())
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

@router.get("/api/predictions", response_model=List[collab_schemas.PredictionResponse])
def get_all_predictions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all recent predictions"""
    predictions = db.query(models.Prediction).order_by(
        models.Prediction.created_at.desc()
    ).offset(skip).limit(limit).all()
    return predictions

@router.get("/api/predictions/station/{station_id}", response_model=List[collab_schemas.PredictionResponse])
def get_predictions_by_station(station_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get predictions for a specific station"""
    station = db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    predictions = db.query(models.Prediction).filter(
        models.Prediction.station_id == station_id
    ).order_by(models.Prediction.created_at.desc()).offset(skip).limit(limit).all()
    return predictions

@router.get("/api/predictions/parameter/{parameter}", response_model=List[collab_schemas.PredictionResponse])
def get_predictions_by_parameter(parameter: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get predictions for a specific parameter"""
    predictions = db.query(models.Prediction).filter(
        models.Prediction.parameter == parameter
    ).order_by(models.Prediction.created_at.desc()).offset(skip).limit(limit).all()
    return predictions

@router.get("/api/predictions/{prediction_id}", response_model=collab_schemas.PredictionWithStation)
def get_prediction_by_id(prediction_id: int, db: Session = Depends(get_db)):
    """Get specific prediction with station details"""
    prediction = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction

@router.delete("/api/predictions/{prediction_id}", status_code=204)
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """Delete a prediction"""
    prediction = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    db.delete(prediction)
    db.commit()
