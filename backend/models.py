from sqlalchemy import Column, Integer, Numeric, String, Boolean, TIMESTAMP, text
from database import Base

# -----------------------------
# WATER READINGS (REPORTS)
# -----------------------------
class WaterReading(Base):
    __tablename__ = "water_readings"

    id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String, nullable=False)

    ph = Column(Numeric(4, 2), nullable=False)
    turbidity = Column(Numeric(6, 2), nullable=False)
    temperature = Column(Numeric(5, 2), nullable=False)

    status = Column(String, nullable=False)  # Safe / Warning / Unsafe

    # NEW: track where data came from
    source = Column(String, default="manual")  # manual / wqp / india_api

    recorded_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )

# -----------------------------
# STATIONS
# -----------------------------
class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    latitude = Column(Numeric(9, 6), nullable=False)
    longitude = Column(Numeric(9, 6), nullable=False)

    # latest snapshot values
    ph = Column(Numeric(4, 2), nullable=False)
    turbidity = Column(Numeric(6, 2), nullable=False)
    temperature = Column(Numeric(5, 2), nullable=False)

    status = Column(String, nullable=False)  # Safe / Warning / Unsafe
    is_online = Column(Boolean, default=True)

    # NEW: station origin
    source = Column(String, default="manual")  # manual / wqp / india_api

# -----------------------------
# ALERTS
# -----------------------------
class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String, nullable=False)
    status = Column(String, nullable=False)   # Unsafe / Warning
    message = Column(String, nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )

# -----------------------------
# USERS
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
