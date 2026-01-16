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

    arsenic = Column(Numeric(6, 4), nullable=True)
    dissolved_oxygen = Column(Numeric(5, 2), nullable=True)
    nitrate = Column(Numeric(6, 2), nullable=True)
    fluoride = Column(Numeric(5, 2), nullable=True)

    status = Column(String, nullable=False)  # Safe / Warning / Unsafe
    source = Column(String, default="manual")

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

    ph = Column(Numeric(4, 2), nullable=False)
    turbidity = Column(Numeric(6, 2), nullable=False)
    temperature = Column(Numeric(5, 2), nullable=False)

    arsenic = Column(Numeric(6, 4), nullable=True)
    dissolved_oxygen = Column(Numeric(5, 2), nullable=True)
    nitrate = Column(Numeric(6, 2), nullable=True)
    fluoride = Column(Numeric(5, 2), nullable=True)

    status = Column(String, nullable=False)  # Safe / Warning / Unsafe
    is_online = Column(Boolean, default=True)
    source = Column(String, default="manual")


# -----------------------------
# ALERTS
# -----------------------------
class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String, nullable=False)
    status = Column(String, nullable=False)   # Warning / Unsafe
    message = Column(String, nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )


# -----------------------------
# USERS (AUTH ONLY)
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)   # ngo / admin / user
