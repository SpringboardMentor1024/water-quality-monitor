from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import numpy as np 
from app.models.readings import StationReading
from app.models.alert import Alert
from app.models.station import WaterStation

class PredictionService:
    
    # 🧠 THE EXPERT KNOWLEDGE BASE
    # Maps specific conditions to professional remediation steps.
    KNOWLEDGE_BASE = {
        "ph_high": "CRITICAL: pH > 8.5. Immediate Action: Stop water intake. Initiate acid injection (HCL or CO2 dosing). Check lime feed pump for malfunction.",
        "ph_low": "WARNING: pH < 6.5. Water is corrosive. Action: Increase Soda Ash or Lime dosage. Check for acid rain inflow or chemical spill near source.",
        "ph_rising": "TREND ALERT: pH rising rapidly (+0.1/hr). Potential alkalizer pump failure. Switch to manual control loop immediately.",
        
        "turbidity_high": "CRITICAL: Turbidity > 5 NTU. Filtration failure likely. Action: Initiate automatic backwash of sand filters. Check coagulant (Alum) dosage levels.",
        "turbidity_rising": "TREND ALERT: Turbidity rising. Sediment load increasing. Action: Pre-treat inflow with settling tank. Inspect flocculation mixers.",
        
        "do_low": "DANGER: Dissolved Oxygen < 4 mg/L. Aquatic life risk. Action: Maximize surface aerators. Check for organic sewage contamination upstream.",
        "do_dropping": "TREND ALERT: Oxygen levels dropping fast. Biological Oxygen Demand (BOD) spike detected. Increase aeration power by 20%."
    }

    @staticmethod
    def analyze_station(db: Session, station_id: int):
        """
        Runs both Real-time Check (Option A) and Trend Prediction (Option B).
        """
        station = db.query(WaterStation).filter(WaterStation.id == station_id).first()
        if not station:
            return None

        # Get last 5 readings for Trend Analysis
        readings = db.query(StationReading).filter(
            StationReading.station_id == station_id
        ).order_by(StationReading.recorded_at.desc()).limit(5).all()

        if not readings:
            return None

        alerts_generated = []

        # Group readings by parameter
        param_history = {} 
        for r in readings:
            p = r.parameter.lower()
            if p not in param_history:
                param_history[p] = []
            param_history[p].append(float(r.value))

        # =========================================
        # 1. OPTION A: REAL-TIME THRESHOLD CHECK
        # =========================================
        if "ph" in param_history:
            val = param_history["ph"][0] # Latest value
            if val > 8.5:
                alerts_generated.append(PredictionService._create_alert_obj(
                    station, 
                    AlertType.contamination, 
                    AlertCategory.current,
                    f"High pH detected ({val}).", 
                    PredictionService.KNOWLEDGE_BASE["ph_high"]
                ))
            elif val < 6.5:
                alerts_generated.append(PredictionService._create_alert_obj(
                    station, 
                    AlertType.contamination, 
                    AlertCategory.current,
                    f"Low pH detected ({val}).", 
                    PredictionService.KNOWLEDGE_BASE["ph_low"]
                ))

        if "turbidity" in param_history:
            val = param_history["turbidity"][0]
            if val > 5.0:
                alerts_generated.append(PredictionService._create_alert_obj(
                    station, 
                    AlertType.contamination, 
                    AlertCategory.current,
                    f"High Turbidity ({val} NTU).", 
                    PredictionService.KNOWLEDGE_BASE["turbidity_high"]
                ))

        # =========================================
        # 2. OPTION B: PREDICTIVE TREND ANALYSIS
        # =========================================
        # We calculate the "Slope" (Rate of Change)
        
        if "ph" in param_history and len(param_history["ph"]) >= 3:
            data = list(reversed(param_history["ph"]))
            slope = data[-1] - data[0] # Simple change over time window
            
            if slope > 0.3: # Rising fast
                alerts_generated.append(PredictionService._create_alert_obj(
                    station, 
                    AlertType.system_warning, 
                    AlertCategory.predictive,
                    f"pH is spiking rapidly (+{round(slope,2)}).", 
                    PredictionService.KNOWLEDGE_BASE["ph_rising"]
                ))

        if "turbidity" in param_history and len(param_history["turbidity"]) >= 3:
             data = list(reversed(param_history["turbidity"]))
             slope = data[-1] - data[0]
             if slope > 1.0: # Getting cloudy fast
                 alerts_generated.append(PredictionService._create_alert_obj(
                    station, 
                    AlertType.system_warning, 
                    AlertCategory.predictive,
                    f"Turbidity increasing rapidly.", 
                    PredictionService.KNOWLEDGE_BASE["turbidity_rising"]
                ))

        # Save Alerts to DB
        unique_alerts = []
        for alert in alerts_generated:
            # Check duplicate to avoid spamming (Logic: Same station, same message)
            exists = db.query(Alert).filter(
                Alert.station_id == alert.station_id, 
                Alert.message == alert.message,
                Alert.category == alert.category
            ).first()
            
            if not exists:
                db.add(alert)
                unique_alerts.append(alert)
        
        db.commit()

        # 🟢 CRITICAL FIX: Return ALL current risks (alerts_generated)
        # NOT just the new ones (unique_alerts).
        # This ensures the API reports the risk even if it was already saved.
        return alerts_generated

    @staticmethod
    def _create_alert_obj(station, type_, cat, msg, action):
        """
        Helper to create the Alert Object with proper links.
        """
        return Alert(
            # Link the Foreign Key so Dashboard can find Name/Lat/Lon
            station_id=station.id,
            
            # Save the location string for backup/display
            location=station.location,
            
            type=type_,
            category=cat,
            message=msg,
            action_taken=action
        )