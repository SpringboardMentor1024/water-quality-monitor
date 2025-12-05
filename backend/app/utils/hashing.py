from passlib.context import CryptContext

# Setup the password context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hasher:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Checks if the typed password matches the hash in the database.
        """
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """
        Turns a plain password into a secure hash.
        """
        return pwd_context.hash(password)