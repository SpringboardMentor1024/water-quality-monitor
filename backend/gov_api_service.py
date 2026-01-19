"""
Government API Integration Service
Integrates with EPA, WHO, and CPCB India APIs for water quality data
"""
import requests
import json
from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class GovernmentAPIService:
    def __init__(self):
        # EPA Water Quality Portal
        self.epa_base_url = "https://www.waterqualitydata.us/data"
        
        # WHO Global Health Observatory API
        self.who_base_url = "https://ghoapi.azureedge.net/api"
        
        # CPCB India - Mock endpoint (no public API available)
        self.cpcb_base_url = "https://app.cpcbccr.com/ccr/api"
        
    def get_epa_water_data(self, state: str = None, county: str = None) -> List[Dict]:
        """
        Fetch water quality data from EPA Water Quality Portal
        """
        try:
            params = {
                'mimeType': 'json',
                'zip': 'no',
                'dataProfile': 'narrowResult',
                'sampleMedia': 'Water'
            }
            
            if state:
                params['statecode'] = state
            if county:
                params['countycode'] = county
                
            response = requests.get(f"{self.epa_base_url}/Result/search", params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return self._format_epa_data(data)
            else:
                logger.warning(f"EPA API returned status {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error fetching EPA data: {e}")
            return []
    
    def get_who_water_data(self, country: str = "USA") -> List[Dict]:
        """
        Fetch water quality indicators from WHO Global Health Observatory
        """
        try:
            # WHO API endpoint for water and sanitation indicators
            endpoint = f"{self.who_base_url}/WASH_WATER"
            
            response = requests.get(endpoint, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return self._format_who_data(data, country)
            else:
                logger.warning(f"WHO API returned status {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error fetching WHO data: {e}")
            return []
    
    def get_cpcb_water_data(self, state: str = None) -> List[Dict]:
        """
        CPCB India APIs are not available - return empty list
        """
        logger.info("CPCB APIs not available")
        return []
    
    def _format_epa_data(self, raw_data: List[Dict]) -> List[Dict]:
        """Format EPA data to our standard format"""
        formatted_data = []
        
        for item in raw_data.get('WQXWeb', []):
            try:
                formatted_item = {
                    "station_name": item.get('MonitoringLocationIdentifier', 'Unknown'),
                    "location": f"{item.get('CountyName', '')}, {item.get('StateName', '')}",
                    "parameters": {
                        item.get('CharacteristicName', 'unknown').lower(): float(item.get('ResultMeasureValue', 0))
                    },
                    "recorded_at": item.get('ActivityStartDate', datetime.now().isoformat()),
                    "source": "EPA"
                }
                formatted_data.append(formatted_item)
            except (ValueError, TypeError):
                continue
                
        return formatted_data
    
    def _format_who_data(self, raw_data: Dict, country: str) -> List[Dict]:
        """Format WHO data to our standard format"""
        formatted_data = []
        
        try:
            for item in raw_data.get('value', []):
                if item.get('SpatialDim', '').upper() == country.upper():
                    formatted_item = {
                        "station_name": f"WHO Indicator - {country}",
                        "location": country,
                        "parameters": {
                            "water_access_percentage": float(item.get('NumericValue', 0))
                        },
                        "recorded_at": f"{item.get('TimeDim', '2023')}-01-01",
                        "source": "WHO"
                    }
                    formatted_data.append(formatted_item)
        except (ValueError, TypeError, KeyError):
            pass
            
        return formatted_data
    
    def get_all_government_data(self, location_params: Dict = None) -> Dict[str, List[Dict]]:
        """
        Fetch data from US EPA and WHO only - no mock data
        """
        results = {
            "epa": [],
            "who": [],
            "fallback_used": False
        }
        
        if location_params:
            state = location_params.get('state')
            country = location_params.get('country', 'USA')
            
            # Fetch EPA data (primary source)
            results["epa"] = self.get_epa_water_data(state=state)
            
            # Fetch WHO data
            results["who"] = self.get_who_water_data(country=country)
        
        return results
    
    def fallback_to_local_data(self, db_session, location: str = None) -> List[Dict]:
        """
        Fallback to local database when government APIs fail
        """
        from models import WaterStation, StationReading
        from sqlalchemy.orm import Session
        
        try:
            query = db_session.query(WaterStation)
            if location:
                query = query.filter(WaterStation.location.ilike(f"%{location}%"))
            
            stations = query.limit(10).all()
            
            local_data = []
            for station in stations:
                # Get latest readings for this station
                latest_readings = db_session.query(StationReading).filter(
                    StationReading.station_id == station.id
                ).order_by(StationReading.recorded_at.desc()).limit(5).all()
                
                parameters = {}
                for reading in latest_readings:
                    parameters[reading.parameter.value] = float(reading.value)
                
                local_data.append({
                    "station_name": station.name,
                    "location": station.location,
                    "parameters": parameters,
                    "recorded_at": latest_readings[0].recorded_at.isoformat() if latest_readings else datetime.now().isoformat(),
                    "source": "Local Database"
                })
            
            return local_data
            
        except Exception as e:
            logger.error(f"Error fetching local data: {e}")
            return []

# Global instance
gov_api_service = GovernmentAPIService()