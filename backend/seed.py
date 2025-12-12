"""Small script to seed the database with example water readings."""
from decimal import Decimal
from datetime import datetime, timezone

from .database import SessionLocal, engine
from . import models


def create_tables():
    models.Base.metadata.create_all(bind=engine)


def seed():
    create_tables()
    db = SessionLocal()
    try:
        samples = [
            models.WaterReading(ph=Decimal('7.00'), turbidity=Decimal('1.20'), temperature=Decimal('22.5')),
            models.WaterReading(ph=Decimal('6.80'), turbidity=Decimal('2.10'), temperature=Decimal('21.0')),
            models.WaterReading(ph=Decimal('7.20'), turbidity=Decimal('0.95'), temperature=Decimal('23.3')),
        ]
        for s in samples:
            db.add(s)
        db.commit()
        print(f"Inserted {len(samples)} sample readings")
    finally:
        db.close()


if __name__ == '__main__':
    seed()
