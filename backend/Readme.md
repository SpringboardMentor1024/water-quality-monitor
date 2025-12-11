# Backend — Water Quality Monitor

Quick guide to run and test the FastAPI backend locally.

Prerequisites

- Python 3.7+ installed
- (Optional) PostgreSQL if you want a production DB; otherwise the project uses a local sqlite fallback

Setup (one-time)

1. From the project root:

```powershell
cd E:\Interships\InfosysSpringboard\backend\water-quality-monitor
python -m venv backend\venv
```

2. Activate the virtual environment (PowerShell):

```powershell
& .\backend\venv\Scripts\Activate.ps1
```

If activation is blocked, allow it for the session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
& .\backend\venv\Scripts\Activate.ps1
```

3. Install dependencies:

```powershell
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Configuration

- To use a specific database, create `backend/.env` with a `DATABASE_URL` (e.g. PostgreSQL):

```
DATABASE_URL=postgresql://user:password@localhost:5432/water_quality_db
```

- If no `DATABASE_URL` is provided, the app will use `sqlite:///./water_quality.db` inside `backend/`.

Run the server

```powershell
# from project root (recommended)
python -m uvicorn backend.main:app --reload

# Or from `backend` folder:
cd backend
uvicorn main:app --reload
```

Test endpoints

- Root: `GET http://127.0.0.1:8000/`
- Swagger UI: `http://127.0.0.1:8000/docs`
- Create a reading (PowerShell):

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/readings \
  -Body (@{ph=7.0; turbidity=1.5; temperature=22.3} | ConvertTo-Json) -ContentType 'application/json'
```

- Get readings:

```powershell
curl http://127.0.0.1:8000/api/readings
```

Seeding sample data

- A helper script exists at `backend/seed.py`.

```powershell
# run as module from project root
.\backend\venv\Scripts\python.exe -m backend.seed
```

Frontend integration

- The backend allows CORS from `http://localhost:3000` by default. If your frontend runs elsewhere, update `allow_origins` in `backend/main.py`.
- Example fetch from frontend:

```javascript
fetch("http://127.0.0.1:8000/api/readings")
  .then((r) => r.json())
  .then((data) => console.log(data));
```

Next steps

- Add Alembic migrations for production databases
- Add tests for endpoints
- Implement more endpoints (filtering, station metadata, auth)

# FastAPI Backend Server Guide for Beginners

Welcome! This guide will help you create a simple FastAPI backend server from scratch. FastAPI is a modern, fast web framework for building APIs with Python. It's perfect for beginners because it's easy to learn and very powerful.

## What is FastAPI?

FastAPI is a web framework for building APIs (Application Programming Interfaces) using Python. It allows you to create web services that can send and receive data. It's fast, easy to use, and automatically generates documentation for your API.

## Prerequisites

Before we start, make sure you have Python installed on your computer. You need Python 3.7 or higher.

- To check if Python is installed, open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and type `python --version` or `python3 --version`.
- If it's not installed, download it from [python.org](https://www.python.org/downloads/).

## Step 1: Install FastAPI and Uvicorn

FastAPI needs a server to run. We'll use Uvicorn, which is a fast ASGI server.

1. Open your terminal.
2. Navigate to your project folder (the "Water Quality Monitor" folder).
3. Run this command:

```bash
pip install fastapi uvicorn
```

This will download and install FastAPI and Uvicorn. If you're using Python 3, you might need to use `pip3` instead of `pip`.

## Step 2: Create Your First FastAPI App

Now, let's create a simple FastAPI application.

1. In your backend folder (`water-quality-monitor/water-quality-monitor/backend/`), create a new file called `main.py`.
2. Open `main.py` in a text editor (like VS Code) and add this code:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
```

This code creates a FastAPI app with one endpoint (route) at the root URL ("/") that returns a JSON message.

## Step 3: Run the Server

Time to start your server!

1. In your terminal, make sure you're in the backend folder.
2. Run this command:

```bash
uvicorn main:app --reload
```

- `main` is the name of your Python file (without .py).
- `app` is the FastAPI instance you created.
- `--reload` means the server will restart automatically when you make changes to your code.

You should see something like:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using statreload
```

## Step 4: Test Your API

Your server is now running! Let's test it.

1. Open your web browser.
2. Go to: http://127.0.0.1:8000/

You should see: `{"Hello":"World"}`

That's your API working!

## Bonus: Interactive API Documentation

FastAPI automatically creates documentation for your API.

- Go to: http://127.0.0.1:8000/docs

You'll see a nice web page where you can test your API endpoints interactively.

## What Next?

- Add more routes: You can add more `@app.get()`, `@app.post()`, etc. for different endpoints.
- Add data: Learn about request bodies, path parameters, and query parameters.
- Connect to a database: Use libraries like SQLAlchemy to store data.
- Deploy: Put your app online using services like Heroku or AWS.

## Troubleshooting

- If you get an error about "pip not found", make sure Python is installed correctly and added to your PATH.
- If the server doesn't start, check that you're in the right folder and the file is named `main.py`.
- If you can't access the URL, make sure no firewall is blocking port 8000.

Happy coding!
