from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
)

async def send_reset_email(email: str, reset_link: str):
    message = MessageSchema(
        subject="Password Reset",
        recipients=[email],
        body=f"Click this link to reset your password:\n\n{reset_link}",
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
