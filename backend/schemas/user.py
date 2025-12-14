# from pydantic import BaseModel, EmailStr

# class UserCreate(BaseModel):
#     name: str
#     email: EmailStr
#     password: str

# # class UserResponse(BaseModel):
# #     id: int
# #     name: str
# #     email: EmailStr

# #     class Config:
# #         orm_mode = True



# class UserResponse(BaseModel):
#     id: int
#     name: str
#     email: str

#     model_config = {
#         "from_attributes": True
#     }
    




# schemas/user.py
from pydantic import BaseModel, EmailStr

# REQUEST MODELS
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# RESPONSE MODELS
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
