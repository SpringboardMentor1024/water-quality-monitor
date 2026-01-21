from database import SessionLocal
import models

db = SessionLocal()

ngo_email = "gkavyasri@gmail.com"  # your NGO login email

existing = db.query(models.NGO).filter(models.NGO.email == ngo_email).first()

if not existing:
    new_ngo = models.NGO(
        name="Gorrela Water Care",
        email=ngo_email,
        region="Hyderabad",
        description="Dedicated NGO improving local water quality."
    )
    db.add(new_ngo)
    db.commit()
    print("✅ NGO profile added successfully!")
else:
    print("⚠️ NGO already exists!")

db.close()
