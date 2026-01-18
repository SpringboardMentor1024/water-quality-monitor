import random

# Simple rule-based predictive model (can replace with real ML later)
def predict_alerts(station):
    """
    Predicts water quality issues based on the latest readings.
    You can later replace this with an actual ML model.
    """

    # Random predictive behavior for demo
    parameters = ["pH", "Turbidity", "Temperature"]
    param = random.choice(parameters)

    prediction = ""
    severity = ""

    if param == "pH":
        if station.ph is not None and (station.ph < 6.5 or station.ph > 8.5):
            prediction = "Abnormal pH expected"
            severity = "High"
        else:
            prediction = "Stable pH"
            severity = "Low"

    elif param == "Turbidity":
        if station.turbidity is not None and station.turbidity > 5:
            prediction = "High Turbidity predicted"
            severity = "Medium"
        else:
            prediction = "Clear water expected"
            severity = "Low"

    elif param == "Temperature":
        if station.temperature is not None and station.temperature > 35:
            prediction = "High Temperature likely"
            severity = "Medium"
        else:
            prediction = "Normal Temperature"
            severity = "Low"

    return {
    "station_name": str(station.name),
    "parameter": str(param),
    "prediction": str(prediction),
    "severity": str(severity),
}
