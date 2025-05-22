# 🚨 AlertFi: Fire Detection and Alert System

**AlertFi** is a real-time fire risk detection system powered by an IoT-based ESP32 device using an MQ2 sensor.  
It features a full-stack solution with a Django REST API backend, a responsive Vite + ReactJS web dashboard, and a Flutter mobile application.

---

## 🌐 Live Deployments

- **🔗 Web Dashboard:** [https://alertfi-web-f5b98.web.app/](https://alertfi-web-f5b98.web.app/)
- **🔗 Backend API (Django):** [https://alertfi-web-7jgc.onrender.com/](https://alertfi-web-7jgc.onrender.com/)
- **🔗 Flutter App (Download):** [Google Drive Link](https://drive.google.com/file/d/1pAHFBBEF7HVOv958Xw1ns0bH5XjVCyDd/view?usp=drivesdk)

---

## 🧩 Features

- 🔥 Real-time gas monitoring via MQ2 sensor and ESP32
- 🌐 RESTful API & WebSocket support for live data
- 📈 PPM gauge with dynamic system status (Safe / Warning / Danger)
- 📊 Historical alert logging and filtering
- 🔐 Secure JWT-based authentication for users and devices
- ☁️ Full deployment using Render, Firebase, GitHub, and Expo

---

## 📬 API Endpoints

| Endpoint                   | Method    | Description                          |
|---------------------------|-----------|--------------------------------------|
| `/admin/`                 | GET       | Django admin dashboard               |
| `/api/register/`          | POST      | Register a new user                  |
| `/api/login/`             | POST      | Login and receive tokens             |
| `/api/token/`             | POST      | Retrieve JWT access & refresh token |
| `/api/token/refresh/`     | POST      | Refresh access token                 |
| `/api/protected/`         | GET       | Auth-protected test route            |
| `/api/alerts/`            | GET/POST  | Retrieve or submit gas alert logs    |
| `/ws/sensor/?token=...`   | WebSocket | Real-time sensor data stream         |

---

## 🚀 Getting Started

### 🔧 Backend (Django + DRF)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```


### 2. Frontend (Vite + ReactJS)

```bash
cd web
npm install
npm run dev
```

### 3. ESP32 (IoT Device)

Flash esp32/fire_alert.ino to the board using Arduino IDE or PlatformIO.
Update the following before flashing:
Wi-Fi credentials
API base URL (e.g., your Render URL)
JWT login and POST handling


## Authentication

Uses JWT tokens for secure access (users & devices).
Flow:
Login → receive token
Send requests with Authorization: Bearer <token>




## Authors

Shun Cyrel Caseres — Frontend & Backend Developer
Faith Gutierrez — Technical Writer & Frontend Developer
Christine B. Sevilla — Frontend Developer
Jayrille Tubera — IoT Developer 
