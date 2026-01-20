from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)

    ngo_id = Column(Integer, ForeignKey("ngos.id"))

    ngo = relationship("NGO", back_populates="projects")
    collaborations = relationship("Collaboration", back_populates="project", cascade="all, delete")
