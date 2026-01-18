import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

# -----------------------------
# DEMO TRAINING DATA
# -----------------------------
# We simulate past readings
# 0 = normal, 1 = contamination risk

X = []
y = []

# Normal values
for _ in range(200):
    X.append([
        np.random.uniform(6.8, 7.5),   # pH
        np.random.uniform(6, 9),       # DO
        np.random.uniform(0, 3)        # turbidity
    ])
    y.append(0)

# Risk values
for _ in range(200):
    X.append([
        np.random.uniform(5.0, 6.4),   # bad pH
        np.random.uniform(2, 4.5),     # low DO
        np.random.uniform(6, 12)       # high turbidity
    ])
    y.append(1)

X = np.array(X)
y = np.array(y)

# -----------------------------
# TRAIN MODEL
# -----------------------------
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# -----------------------------
# SAVE MODEL
# -----------------------------
joblib.dump(model, "backend/predictive/model.joblib")

print("✅ Model trained and saved successfully")
