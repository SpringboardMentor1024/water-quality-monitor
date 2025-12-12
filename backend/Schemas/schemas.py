from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str

class User(BaseModel):
    id: int
    name: str
