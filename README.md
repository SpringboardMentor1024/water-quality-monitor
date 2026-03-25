# 🌊 Water Quality Monitoring System

> A full-stack web application developed during the **Infosys Springboard Virtual Internship** to monitor and analyze real-time water quality data, generate alerts, and support decision-making through dashboards and insights.

---

## 📌 Project Overview

The **Water Quality Monitoring System** tracks water conditions from multiple monitoring stations, provides real-time updates, and alerts users about potential risks such as contamination or outages.

This system helps improve awareness, safety, and response time by delivering accurate and structured data insights to communities and authorities.

---

## 🎯 Key Features

- 📍 Real-time water quality monitoring
- 🗺️ Interactive map view with station search
- 📊 Advanced dashboard visualizations
- 🚨 Alerts module (Contamination, Boil Notice, Outage)
- 📈 Historical data analysis & trend charts
- 🔍 Filtering and search functionality
- 🤝 NGO collaboration module
- ⚡ Predictive alert system (ML-based)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | SQLite (SQLAlchemy ORM) |
| ML | scikit-learn |
| Auth | JWT (JSON Web Tokens) |

---

## 📁 Project Structure

```
water-quality-monitor/
├── frontend/          # React.js frontend application
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page-level components
│       └── services/      # API service layer
├── backend/           # FastAPI backend application
│   ├── main.py            # API routes and endpoints
│   ├── models.py          # Database models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # JWT authentication
│   └── ml_predictor.py    # ML prediction module
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- Python >= 3.9

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs at `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/stations` | Get all monitoring stations |
| GET | `/api/alerts` | Get all alerts |
| GET | `/api/alerts/historical?period=7d` | Historical alert data |
| GET | `/api/reports` | Get all reports |
| GET | `/api/predictive-alerts` | ML-based predictions |

---

## 🚀 Project Milestones

| Milestone | Description |
|-----------|-------------|
| **Milestone 1** | Application setup, UI integration, database setup |
| **Milestone 2** | Backend APIs and real-time data integration |
| **Milestone 3** | Alerts system and historical data features |
| **Milestone 4** | NGO modules, dashboards, predictive alerts, deployment |

---

## 👥 Team — Team E

| Name | Role |
|------|------|
| **Anil** | Backend Developer |
| **Pragna** | Frontend Developer |
| **Sandhyarani** | Frontend & Integration |

---

## 👨‍🏫 Mentor

**Ritwik Abhijeet** — Software Development Engineer, Infosys

---

## 👨‍💻 My Contribution (Backend Developer)

- Designed and implemented **database schema and entities**
- Developed **REST APIs** for data handling and integration
- Built **Alerts module** with full CRUD operations
- Implemented **historical data aggregation endpoints**
- Enabled **filtering and search functionality**
- Integrated **ML-based predictive alert system**
- Managed **backend architecture and deployment readiness**

---

## 📈 What I Learned

- Backend development using real-world use cases
- API design and database management with FastAPI & SQLAlchemy
- JWT-based authentication and security best practices
- Team collaboration and agile workflow
- Problem-solving and debugging in production-like environments

---

## ⭐ Future Improvements

- Mobile responsiveness
- AI-based water quality prediction (enhanced)
- Integration with IoT sensors
- Cloud deployment and scalability

---

## 🙏 Acknowledgement

Special thanks to **Infosys Springboard**, our mentor **Ritwik Abhijeet**, and teammates **Pragna** and **Sandhyarani** for their continuous support and guidance throughout this internship.

---

## 🔗 Links

- 🐙 GitHub: [water-quality-monitor (team-e)](https://github.com/SpringboardMentor1024/water-quality-monitor/tree/team-e/)
- 🏢 Internship: [Infosys Springboard](https://springboard.infosys.com/)
- 🎥 Demo Video: [Watch on Google Drive](https://drive.google.com/file/d/1MR5udHvgeECP1yYE4tZB6mYoKRuAGnet/view?usp=drivesdk)

---

⭐ If you found this project helpful, consider giving it a star!
