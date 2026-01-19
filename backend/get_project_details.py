@router.get("/projects/{project_id}")
def get_project_details(project_id: int, db: Session = Depends(get_db)):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    stations = (
        db.query(models.Station)
        .select_from(models.StationAssignment)
        .join(
            models.Station,
            models.Station.id == models.StationAssignment.station_id
        )
        .filter(models.StationAssignment.project_id == project_id)
        .all()
    )

    return {
        "id": project.id,
        "name": project.name,
        "description": project.description or "",
        "due_date": project.due_date or "N/A",
        "stations": [
            {
                "id": s.id,
                "name": s.name,
                "lat": float(s.latitude) if s.latitude else 0.0,
                "lon": float(s.longitude) if s.longitude else 0.0,
            }
            for s in stations
        ]
    }
