from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Users
from dependencies import get_db, get_current_user
from models import (
    Users,
    NGOs,
    Projects,
    UserRole,
    WaterStation,
    Reports
)


from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


router = APIRouter(
    prefix="/ngo/projects",
    tags=["NGO Projects"]
)

# -----------------------------
# GET PROJECTS FOR NGO
# -----------------------------
@router.get("/")
def get_ngo_projects(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # 1️⃣ Check role
    if current_user.role != UserRole.ngo:
        raise HTTPException(status_code=403, detail="Access denied")

    # 2️⃣ Get NGO record
    ngo = db.query(NGOs).filter(NGOs.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    # 3️⃣ Get projects
    projects = db.query(Projects).filter(
        Projects.ngo_id == ngo.id
    ).all()

    return projects
@router.post("/")
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # 1️⃣ Allow only NGO
    if current_user.role != UserRole.ngo:
        raise HTTPException(status_code=403, detail="Access denied")

    # 2️⃣ Find NGO record
    ngo = db.query(NGOs).filter(
        NGOs.user_id == current_user.id
    ).first()

    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    # 3️⃣ Create project
    project = Projects(
        ngo_id=ngo.id,
        name=data.name,
        description=data.description,
        start_date=data.start_date,
        end_date=data.end_date
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": "Project created successfully",
        "project_id": project.id
    }

@router.get("/{project_id}/details")
def get_project_details(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # 1️⃣ Only NGO allowed
    if current_user.role != UserRole.ngo:
        raise HTTPException(status_code=403, detail="Access denied")

    # 2️⃣ Get NGO row
    ngo = db.query(NGOs).filter(NGOs.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    # 3️⃣ Get project
    project = db.query(Projects).filter(
        Projects.id == project_id,
        Projects.ngo_id == ngo.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 4️⃣ Get NGO user (for email)
    user = db.query(Users).filter(Users.id == ngo.user_id).first()

    # 5️⃣ Get reports for this NGO (project-specific later)
    reports = db.query(Reports).filter(
        Reports.user_id == current_user.id
    ).all()

    return {
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "start_date": project.start_date,
            "end_date": project.end_date
        },
        "ngo": {
            "name": ngo.name,
            "location": ngo.location,
            "email": user.email if user else None
        },
        "reports": [
            {
                "id": r.id,
                "description": r.description,
                "status": r.status.value,
                "created_at": r.created_at
            }
            for r in reports
        ]
    }
