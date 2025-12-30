from fastapi.security import OAuth2PasswordBearer

# Setup the OAuth2 Scheme
# This tells FastAPI (and the automatic Swagger UI documentation) 
# that the API endpoint to get a token is "/auth/login".
# This enables the "Authorize" lock button in your API docs.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")