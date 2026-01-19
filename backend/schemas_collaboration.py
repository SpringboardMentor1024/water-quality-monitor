from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from schemas import WaterStationResponse, WaterParameter

# ============== NGO COLLABORATION SCHEMAS ==============

# --- NGO Schemas ---

class NGOCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    established_date: Optional[datetime] = None
    description: Optional[str] = None
    website: Optional[str] = None

class NGOUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None

class NGOResponse(NGOCreate):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class NGOWithProjects(NGOResponse):
    projects: Optional[List['ProjectResponse']] = []
    stations: Optional[List[WaterStationResponse]] = []


# --- Project Schemas ---

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"
    start_date: datetime
    end_date: Optional[datetime] = None
    budget: Optional[Decimal] = None
    manager_id: Optional[int] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    end_date: Optional[datetime] = None
    budget: Optional[Decimal] = None

class ProjectResponse(ProjectCreate):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ProjectWithDetails(ProjectResponse):
    ngos: Optional[List[NGOResponse]] = []
    stations: Optional[List[WaterStationResponse]] = []


# --- Collaboration Schemas ---

class CollaborationCreate(BaseModel):
    ngo1_id: int
    ngo2_id: int
    project_id: Optional[int] = None
    status: str = "active"
    start_date: datetime
    end_date: Optional[datetime] = None
    agreement_details: Optional[str] = None

class CollaborationUpdate(BaseModel):
    status: Optional[str] = None
    end_date: Optional[datetime] = None
    agreement_details: Optional[str] = None

class CollaborationResponse(CollaborationCreate):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class CollaborationWithDetails(CollaborationResponse):
    ngo1: Optional[NGOResponse] = None
    ngo2: Optional[NGOResponse] = None
    project: Optional[ProjectResponse] = None


# --- Assignment Schemas ---

class ProjectNGOAssignmentCreate(BaseModel):
    project_id: int
    ngo_id: int
    contract_period_start: datetime
    contract_period_end: Optional[datetime] = None

class ProjectNGOAssignmentResponse(ProjectNGOAssignmentCreate):
    assigned_date: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ProjectStationAssignmentCreate(BaseModel):
    project_id: int
    station_id: int
    assignment_period_start: datetime
    assignment_period_end: Optional[datetime] = None

class ProjectStationAssignmentResponse(ProjectStationAssignmentCreate):
    assigned_date: datetime
    
    model_config = ConfigDict(from_attributes=True)


# --- Prediction Schemas ---

class PredictionCreate(BaseModel):
    station_id: int
    parameter: WaterParameter
    current_value: Decimal
    predicted_value: Decimal
    probability: Decimal
    expected_alert_date: Optional[datetime] = None
    trend: Optional[str] = None
    risk_level: str
    review_content: Optional[str] = None

class PredictionResponse(PredictionCreate):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PredictionWithStation(PredictionResponse):
    station: Optional[WaterStationResponse] = None
