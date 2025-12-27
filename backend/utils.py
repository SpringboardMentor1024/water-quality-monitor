import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt
from datetime import datetime, timedelta
import bcrypt
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

MAIL_SENDER = os.getenv("MAIL_SENDER")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

# ----------------------
# SECRET KEY FOR JWT
# ----------------------
SECRET_KEY = "supersecret123"

# ----------------------
# Create Reset Token
# ----------------------
def create_reset_token(email: str):
    expiration = datetime.utcnow() + timedelta(minutes=30)
    payload = {"email": email, "exp": expiration}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# ----------------------
# Verify Reset Token
# ----------------------
def verify_reset_token(token: str):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded.get("email")
    except Exception:
        return None

# ----------------------
# Send Password Reset Email
# ----------------------
def send_reset_email(to_email: str, token: str):
    reset_link = f"http://localhost:3000/reset-password?token={token}"

    subject = "Password Reset Request"
    body = f"""
Hello,

Click the link below to reset your password:

{reset_link}

This link expires in 30 minutes.

If you did not request this, ignore this mail.
"""

    msg = MIMEMultipart()
    msg["From"] = MAIL_SENDER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(MAIL_SENDER, MAIL_PASSWORD)
            smtp.sendmail(MAIL_SENDER, to_email, msg.as_string())
        print(f"Password reset email sent to {to_email}")
    except Exception as e:
        print("Email error:", e)
        raise e

# ----------------------
# Hash Password
# ----------------------
def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

# ----------------------
# Verify Password
# ----------------------
def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode(), hashed.encode())