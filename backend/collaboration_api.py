"""
CRUD APIs for NGO Collaboration entities
Includes: NGOs, Projects, Collaborations, NGO-Station assignments, and Predictions
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from database import get_db
import models, schemas

router = APIRouter(prefix="/api", tags=["collaborations"])

# ============= NGO CRUD APIs =============

@router.post("/ngos", response_model=schemas.NGOResponse, status_code=201)
def create_ngo(ngo: schemas.NGOCreate, db: Session = Depends(get_db)):
    """Create a new NGO"""
    # Check if NGO with same name already exists
    existing = db.query(models.NGO).filter(models.NGO.name == ngo.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="NGO with this name already exists")
    
    db_ngo = models.NGO(**ngo.model_dump())
    db.add(db_ngo)
    db.commit()
    db.refresh(db_ngo)
    return db_ngo


@router.get("/ngos", response_model=List[schemas.NGOResponse])
def get_all_ngos(db: Session = Depends(get_db)):
    """Get all NGOs"""
    return db.query(models.NGO).all()


@router.get("/ngos/{ngo_id}", response_model=schemas.NGOResponse)
def get_ngo(ngo_id: int, db: Session = Depends(get_db)):
    """Get a specific NGO by ID"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo


@router.put("/ngos/{ngo_id}", response_model=schemas.NGOResponse)
def update_ngo(ngo_id: int, ngo_update: schemas.NGOUpdate, db: Session = Depends(get_db)):
    """Update an NGO"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    update_data = ngo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ngo, key, value)
    
    db.commit()
    db.refresh(ngo)
    return ngo


@router.delete("/ngos/{ngo_id}", status_code=204)
def delete_ngo(ngo_id: int, db: Session = Depends(get_db)):
    """Delete an NGO"""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    db.delete(ngo)
    db.commit()


# ============= PROJECT CRUD APIs =============

@router.post("/projects", response_model=schemas.ProjectResponse, status_code=201)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    """Create a new Project"""
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/projects", response_model=List[schemas.ProjectResponse])
def get_all_projects(db: Session = Depends(get_db)):
    """Get all Projects"""
    return db.query(models.Project).all()


@router.get("/projects/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific Project by ID"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/projects/{project_id}", response_model=schemas.ProjectResponse)
def update_project(project_id: int, project_update: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    """Update a Project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a Project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()


# ============= COLLABORATION CRUD APIs =============

@router.post("/collaborations", response_model=schemas.CollaborationResponse, status_code=201)
def create_collaboration(collab: schemas.CollaborationCreate, db: Session = Depends(get_db)):
    """Create a new Collaboration between NGO and Project"""
    # Verify project and NGO exist
    project = db.query(models.Project).filter(models.Project.id == collab.project_id).first()
    ngo = db.query(models.NGO).filter(models.NGO.id == collab.ngo_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    db_collab = models.Collaboration(**collab.model_dump())
    db.add(db_collab)
    db.commit()
    db.refresh(db_collab)
    return db_collab


@router.get("/collaborations", response_model=List[schemas.CollaborationResponse])
def get_all_collaborations(db: Session = Depends(get_db)):
    """Get all Collaborations"""
    return db.query(models.Collaboration).all()


@router.get("/collaborations/{collab_id}", response_model=schemas.CollaborationResponse)
def get_collaboration(collab_id: int, db: Session = Depends(get_db)):
    """Get a specific Collaboration by ID"""
    collab = db.query(models.Collaboration).filter(models.Collaboration.id == collab_id).first()
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    return collab


@router.get("/collaborations/project/{project_id}", response_model=List[schemas.CollaborationResponse])
def get_collaborations_by_project(project_id: int, db: Session = Depends(get_db)):
    """Get all Collaborations for a specific Project"""
    return db.query(models.Collaboration).filter(models.Collaboration.project_id == project_id).all()


@router.get("/collaborations/ngo/{ngo_id}", response_model=List[schemas.CollaborationResponse])
def get_collaborations_by_ngo(ngo_id: int, db: Session = Depends(get_db)):
    """Get all Collaborations for a specific NGO"""
    return db.query(models.Collaboration).filter(models.Collaboration.ngo_id == ngo_id).all()


@router.put("/collaborations/{collab_id}", response_model=schemas.CollaborationResponse)
def update_collaboration(collab_id: int, collab_update: schemas.CollaborationUpdate, db: Session = Depends(get_db)):
    """Update a Collaboration"""
    collab = db.query(models.Collaboration).filter(models.Collaboration.id == collab_id).first()
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    update_data = collab_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(collab, key, value)
    
    db.commit()
    db.refresh(collab)
    return collab


@router.delete("/collaborations/{collab_id}", status_code=204)
def delete_collaboration(collab_id: int, db: Session = Depends(get_db)):
    """Delete a Collaboration"""
    collab = db.query(models.Collaboration).filter(models.Collaboration.id == collab_id).first()
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    db.delete(collab)
    db.commit()


# ============= NGO STATION ASSIGNMENT APIs =============

@router.post("/ngo-stations", response_model=schemas.NGOStationResponse, status_code=201)
def assign_station_to_ngo(assignment: schemas.NGOStationCreate, db: Session = Depends(get_db)):
    """Assign a water station to an NGO for a project"""
    # Verify all entities exist
    ngo = db.query(models.NGO).filter(models.NGO.id == assignment.ngo_id).first()
    project = db.query(models.Project).filter(models.Project.id == assignment.project_id).first()
    station = db.query(models.WaterStation).filter(models.WaterStation.id == assignment.station_id).first()
    
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not station:
        raise HTTPException(status_code=404, detail="Water Station not found")
    
    db_assignment = models.NGOStation(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.get("/ngo-stations", response_model=List[schemas.NGOStationResponse])
def get_all_ngo_stations(db: Session = Depends(get_db)):
    """Get all NGO Station assignments"""
    return db.query(models.NGOStation).all()


@router.get("/ngo-stations/ngo/{ngo_id}", response_model=List[schemas.NGOStationResponse])
def get_stations_for_ngo(ngo_id: int, db: Session = Depends(get_db)):
    """Get all stations assigned to a specific NGO"""
    return db.query(models.NGOStation).filter(models.NGOStation.ngo_id == ngo_id).all()


@router.get("/ngo-stations/project/{project_id}", response_model=List[schemas.NGOStationResponse])
def get_stations_for_project(project_id: int, db: Session = Depends(get_db)):
    """Get all stations assigned in a specific project"""
    return db.query(models.NGOStation).filter(models.NGOStation.project_id == project_id).all()


@router.put("/ngo-stations/{assignment_id}", response_model=schemas.NGOStationResponse)
def unassign_station(assignment_id: int, update: schemas.NGOStationUpdate, db: Session = Depends(get_db)):
    """Unassign a station from an NGO"""
    assignment = db.query(models.NGOStation).filter(models.NGOStation.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assignment, key, value)
    
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/ngo-stations/{assignment_id}", status_code=204)
def delete_ngo_station(assignment_id: int, db: Session = Depends(get_db)):
    """Delete an NGO Station assignment"""
    assignment = db.query(models.NGOStation).filter(models.NGOStation.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assignment)
    db.commit()


# ============= PREDICTION APIs =============

@router.post("/predictions", response_model=schemas.PredictionResponse, status_code=201)
def create_prediction(prediction: schemas.PredictionCreate, db: Session = Depends(get_db)):
    """Create a new Prediction"""
    # Verify station exists
    station = db.query(models.WaterStation).filter(models.WaterStation.id == prediction.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Water Station not found")
    
    db_prediction = models.Prediction(**prediction.model_dump())
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction


@router.get("/predictions", response_model=List[schemas.PredictionResponse])
def get_all_predictions(station_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get all Predictions, optionally filtered by station_id"""
    query = db.query(models.Prediction)
    
    if station_id:
        query = query.filter(models.Prediction.station_id == station_id)
    
    return query.all()


@router.get("/predictions/{prediction_id}", response_model=schemas.PredictionResponse)
def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """Get a specific Prediction by ID"""
    prediction = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction


@router.get("/predictions/station/{station_id}", response_model=List[schemas.PredictionResponse])
def get_predictions_for_station(station_id: int, db: Session = Depends(get_db)):
    """Get all Predictions for a specific station"""
    return db.query(models.Prediction).filter(models.Prediction.station_id == station_id).all()


@router.get("/predictions/station/{station_id}/latest", response_model=List[schemas.PredictionResponse])
def get_latest_predictions_for_station(station_id: int, db: Session = Depends(get_db)):
    """Get latest predictions for each parameter for a station"""
    # Get the most recent prediction for each parameter
    predictions = db.query(models.Prediction).filter(
        models.Prediction.station_id == station_id
    ).order_by(models.Prediction.created_at.desc()).all()
    
    # Keep only latest for each parameter
    seen_params = set()
    result = []
    for pred in predictions:
        if pred.parameter not in seen_params:
            result.append(pred)
            seen_params.add(pred.parameter)
    
    return result


@router.put("/predictions/{prediction_id}", response_model=schemas.PredictionResponse)
def update_prediction(prediction_id: int, pred_update: schemas.PredictionUpdate, db: Session = Depends(get_db)):
    """Update a Prediction (typically the review content)"""
    prediction = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    update_data = pred_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(prediction, key, value)
    
    db.commit()
    db.refresh(prediction)
    return prediction


@router.delete("/predictions/{prediction_id}", status_code=204)
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """Delete a Prediction"""
    prediction = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    db.delete(prediction)
    db.commit()
