# Quick fix for teammate - replace the problematic function

# In main.py, replace the get_station_by_id function with this:

@app.get("/api/stations/{station_id}")
def get_station_by_id(station_id: str, db: Session = Depends(get_db)):
    """Get station by ID - compatible version"""
    try:
        # Convert to numeric if needed
        if station_id.startswith('STN-'):
            numeric_id = int(station_id.replace('STN-', ''))
        else:
            numeric_id = int(station_id)
        
        # Simple query without custom_id
        station = db.query(models.WaterStation).filter(
            models.WaterStation.id == numeric_id
        ).first()
        
        if not station:
            raise HTTPException(status_code=404, detail="Station not found")
        
        return {
            'id': f'STN-{station.id:03d}',
            'name': station.name,
            'location': station.location,
            'latitude': float(station.latitude),
            'longitude': float(station.longitude),
            'managed_by': station.managed_by,
            'status': 'active',
            'created_at': station.created_at.isoformat() if station.created_at else datetime.utcnow().isoformat(),
            'currentReading': {}
        }
        
    except Exception as e:
        print(f"Error fetching station {station_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")