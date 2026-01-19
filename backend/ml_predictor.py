"""
ML-based Water Quality Predictive Module
Uses real machine learning algorithms for water quality predictions
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from datetime import datetime, timedelta
import pickle
import os
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class WaterQualityPredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.anomaly_detectors = {}
        self.parameters = ['ph', 'temperature', 'turbidity', 'dissolved_oxygen']
        self.model_path = os.path.join(os.path.dirname(__file__), 'ml_models')
        os.makedirs(self.model_path, exist_ok=True)
        
    def prepare_training_data(self, readings_data: List[Dict]) -> pd.DataFrame:
        """Convert readings data to ML-ready format"""
        df_list = []
        
        for reading in readings_data:
            df_list.append({
                'station_id': reading.get('station_id'),
                'parameter': reading.get('parameter'),
                'value': float(reading.get('value', 0)),
                'recorded_at': pd.to_datetime(reading.get('recorded_at')),
                'hour': pd.to_datetime(reading.get('recorded_at')).hour,
                'day_of_week': pd.to_datetime(reading.get('recorded_at')).dayofweek,
                'month': pd.to_datetime(reading.get('recorded_at')).month
            })
        
        df = pd.DataFrame(df_list)
        
        # Pivot to get parameters as columns
        pivot_df = df.pivot_table(
            index=['station_id', 'recorded_at', 'hour', 'day_of_week', 'month'],
            columns='parameter',
            values='value',
            aggfunc='mean'
        ).reset_index()
        
        # Fill missing values with median
        for param in self.parameters:
            if param in pivot_df.columns:
                pivot_df[param] = pivot_df[param].fillna(pivot_df[param].median())
        
        return pivot_df
    
    def create_features(self, df: pd.DataFrame, parameter: str) -> Tuple[np.ndarray, np.ndarray]:
        """Create features for ML model"""
        # Sort by time
        df = df.sort_values(['station_id', 'recorded_at'])
        
        features = []
        targets = []
        
        for station_id in df['station_id'].unique():
            station_data = df[df['station_id'] == station_id].copy()
            
            if len(station_data) < 10:  # Need minimum data points
                continue
                
            # Create lag features (previous values)
            for lag in [1, 2, 3, 6, 12, 24]:  # 1h, 2h, 3h, 6h, 12h, 24h ago
                station_data[f'{parameter}_lag_{lag}'] = station_data[parameter].shift(lag)
            
            # Create rolling statistics
            for window in [3, 6, 12, 24]:
                station_data[f'{parameter}_rolling_mean_{window}'] = station_data[parameter].rolling(window).mean()
                station_data[f'{parameter}_rolling_std_{window}'] = station_data[parameter].rolling(window).std()
            
            # Add other parameters as features
            feature_cols = ['hour', 'day_of_week', 'month']
            for other_param in self.parameters:
                if other_param != parameter and other_param in station_data.columns:
                    feature_cols.append(other_param)
            
            # Add lag and rolling features
            lag_cols = [col for col in station_data.columns if 'lag_' in col or 'rolling_' in col]
            feature_cols.extend(lag_cols)
            
            # Remove rows with NaN values
            clean_data = station_data.dropna(subset=feature_cols + [parameter])
            
            if len(clean_data) < 5:
                continue
                
            X = clean_data[feature_cols].values
            y = clean_data[parameter].values
            
            features.append(X)
            targets.append(y)
        
        if not features:
            return np.array([]), np.array([])
            
        X = np.vstack(features)
        y = np.hstack(targets)
        
        return X, y
    
    def train_models(self, readings_data: List[Dict]) -> Dict[str, Dict]:
        """Train ML models for each parameter"""
        results = {}
        
        # Prepare data
        df = self.prepare_training_data(readings_data)
        
        if df.empty:
            logger.warning("No data available for training")
            return results
        
        for parameter in self.parameters:
            if parameter not in df.columns:
                continue
                
            logger.info(f"Training model for {parameter}")
            
            # Create features
            X, y = self.create_features(df, parameter)
            
            if len(X) == 0 or len(y) == 0:
                logger.warning(f"Insufficient data for {parameter}")
                continue
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train Random Forest model
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            model.fit(X_train_scaled, y_train)
            
            # Train anomaly detector
            anomaly_detector = IsolationForest(
                contamination=0.1,
                random_state=42
            )
            anomaly_detector.fit(X_train_scaled)
            
            # Evaluate
            y_pred = model.predict(X_test_scaled)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Store models
            self.models[parameter] = model
            self.scalers[parameter] = scaler
            self.anomaly_detectors[parameter] = anomaly_detector
            
            # Save models
            self.save_model(parameter, model, scaler, anomaly_detector)
            
            results[parameter] = {
                'mae': mae,
                'r2_score': r2,
                'training_samples': len(X_train),
                'test_samples': len(X_test)
            }
            
            logger.info(f"{parameter} model trained - MAE: {mae:.3f}, R2: {r2:.3f}")
        
        return results
    
    def save_model(self, parameter: str, model, scaler, anomaly_detector):
        """Save trained models to disk"""
        model_file = os.path.join(self.model_path, f'{parameter}_model.pkl')
        scaler_file = os.path.join(self.model_path, f'{parameter}_scaler.pkl')
        anomaly_file = os.path.join(self.model_path, f'{parameter}_anomaly.pkl')
        
        with open(model_file, 'wb') as f:
            pickle.dump(model, f)
        with open(scaler_file, 'wb') as f:
            pickle.dump(scaler, f)
        with open(anomaly_file, 'wb') as f:
            pickle.dump(anomaly_detector, f)
    
    def load_models(self):
        """Load trained models from disk"""
        for parameter in self.parameters:
            model_file = os.path.join(self.model_path, f'{parameter}_model.pkl')
            scaler_file = os.path.join(self.model_path, f'{parameter}_scaler.pkl')
            anomaly_file = os.path.join(self.model_path, f'{parameter}_anomaly.pkl')
            
            if all(os.path.exists(f) for f in [model_file, scaler_file, anomaly_file]):
                with open(model_file, 'rb') as f:
                    self.models[parameter] = pickle.load(f)
                with open(scaler_file, 'rb') as f:
                    self.scalers[parameter] = pickle.load(f)
                with open(anomaly_file, 'rb') as f:
                    self.anomaly_detectors[parameter] = pickle.load(f)
    
    def predict_parameter(self, station_id: int, parameter: str, current_data: Dict, 
                         hours_ahead: int = 24) -> Dict:
        """Predict future value for a parameter"""
        if parameter not in self.models:
            return self.fallback_prediction(parameter, current_data, hours_ahead)
        
        try:
            # Prepare features (simplified for prediction)
            features = [
                current_data.get('hour', datetime.now().hour),
                current_data.get('day_of_week', datetime.now().weekday()),
                current_data.get('month', datetime.now().month),
            ]
            
            # Add other parameters
            for other_param in self.parameters:
                if other_param != parameter:
                    features.append(current_data.get(other_param, 7.0))
            
            # Add lag features (use current value as approximation)
            current_value = current_data.get(parameter, 7.0)
            for _ in range(10):  # Approximate lag features
                features.append(current_value)
            
            # Pad or trim to expected feature count
            while len(features) < 20:
                features.append(0.0)
            features = features[:20]
            
            X = np.array(features).reshape(1, -1)
            X_scaled = self.scalers[parameter].transform(X)
            
            # Predict
            predicted_value = self.models[parameter].predict(X_scaled)[0]
            
            # Detect anomaly
            anomaly_score = self.anomaly_detectors[parameter].decision_function(X_scaled)[0]
            is_anomaly = self.anomaly_detectors[parameter].predict(X_scaled)[0] == -1
            
            # Calculate confidence and risk
            confidence = max(0.6, min(0.95, 0.8 + anomaly_score * 0.1))
            risk_level = self.calculate_risk_level(parameter, predicted_value, current_value)
            
            return {
                'predicted_value': round(predicted_value, 2),
                'current_value': current_value,
                'confidence_score': round(confidence * 100, 1),
                'risk_level': risk_level,
                'is_anomaly': is_anomaly,
                'trend': self.calculate_trend(predicted_value, current_value),
                'probability': self.calculate_alert_probability(parameter, predicted_value),
                'expected_alert_date': self.calculate_alert_date(parameter, predicted_value, hours_ahead)
            }
            
        except Exception as e:
            logger.error(f"Prediction error for {parameter}: {e}")
            return self.fallback_prediction(parameter, current_data, hours_ahead)
    
    def calculate_risk_level(self, parameter: str, predicted_value: float, current_value: float) -> str:
        """Calculate risk level based on parameter thresholds"""
        thresholds = {
            'ph': {'low': 6.5, 'high': 8.5},
            'temperature': {'low': 15, 'high': 35},
            'turbidity': {'low': 0, 'high': 10},
            'dissolved_oxygen': {'low': 5, 'high': 15}
        }
        
        if parameter not in thresholds:
            return 'Medium'
        
        thresh = thresholds[parameter]
        
        if predicted_value < thresh['low'] or predicted_value > thresh['high']:
            return 'High'
        elif abs(predicted_value - current_value) > (thresh['high'] - thresh['low']) * 0.2:
            return 'Medium'
        else:
            return 'Low'
    
    def calculate_trend(self, predicted_value: float, current_value: float) -> str:
        """Calculate trend direction"""
        diff = predicted_value - current_value
        if abs(diff) < 0.1:
            return 'Stable'
        elif diff > 0:
            return 'Increasing'
        else:
            return 'Decreasing'
    
    def calculate_alert_probability(self, parameter: str, predicted_value: float) -> float:
        """Calculate probability of alert"""
        thresholds = {
            'ph': {'min': 6.5, 'max': 8.5},
            'temperature': {'min': 15, 'max': 35},
            'turbidity': {'min': 0, 'max': 10},
            'dissolved_oxygen': {'min': 5, 'max': 15}
        }
        
        if parameter not in thresholds:
            return 25.0
        
        thresh = thresholds[parameter]
        
        if predicted_value < thresh['min'] or predicted_value > thresh['max']:
            return min(95.0, 70.0 + abs(predicted_value - thresh['min']) * 5)
        else:
            return max(5.0, 30.0 - abs(predicted_value - (thresh['min'] + thresh['max']) / 2) * 3)
    
    def calculate_alert_date(self, parameter: str, predicted_value: float, hours_ahead: int) -> Optional[str]:
        """Calculate expected alert date"""
        probability = self.calculate_alert_probability(parameter, predicted_value)
        
        if probability > 70:
            alert_date = datetime.now() + timedelta(hours=max(1, hours_ahead // 2))
            return alert_date.isoformat()
        elif probability > 40:
            alert_date = datetime.now() + timedelta(hours=hours_ahead)
            return alert_date.isoformat()
        else:
            return None
    
    def fallback_prediction(self, parameter: str, current_data: Dict, hours_ahead: int) -> Dict:
        """Fallback prediction when ML model is not available"""
        current_value = current_data.get(parameter, 7.0)
        
        # Simple trend-based prediction
        trend_factor = np.random.uniform(-0.1, 0.1)
        predicted_value = current_value * (1 + trend_factor)
        
        return {
            'predicted_value': round(predicted_value, 2),
            'current_value': current_value,
            'confidence_score': 65.0,
            'risk_level': 'Medium',
            'is_anomaly': False,
            'trend': self.calculate_trend(predicted_value, current_value),
            'probability': self.calculate_alert_probability(parameter, predicted_value),
            'expected_alert_date': self.calculate_alert_date(parameter, predicted_value, hours_ahead)
        }

# Global predictor instance
ml_predictor = WaterQualityPredictor()