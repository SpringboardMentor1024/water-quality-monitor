from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def test():
    return {"status": "THIS IS DEFINITELY MY FILE"}

