# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database import get_db
# from models.user import User

# router = APIRouter(prefix="/password", tags=["password-reset"])

# @router.post("/forgot-password")
# def forgot_password(email: str, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == email).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # TEMP: just return message (email sending comes next)
#     return {
#         "message": "If this email exists, a reset link will be sent"
#     }
    
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.email import send_reset_email
from utils.security import hash_password

router = APIRouter(prefix="/password", tags=["password-reset"])

@router.post("/forgot-password")
async def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # security best practice
        return {"message": "If this email exists, a reset link will be sent"}

    reset_link = f"http://localhost:3000/reset-password?email={email}"

    await send_reset_email(email, reset_link)

    return {"message": "If this email exists, a reset link will be sent"}


@router.post("/reset-password")
def reset_password(
    email: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(new_password)
    db.commit()

    return {"message": "Password reset successful"}

