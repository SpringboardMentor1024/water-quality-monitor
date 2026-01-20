from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    contact_person = Column(String(150))
    location = Column(String(150))
    description = Column(Text)

    projects = relationship("Project", back_populates="ngo", cascade="all, delete")
    collaborations = relationship("Collaboration", back_populates="ngo", cascade="all, delete")
