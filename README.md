# 🚨 AlertFi: Fire Detection and Alert System

*AlertFi* is a real-time fire risk detection system using an IoT-based ESP32 device with an MQ2 gas sensor.  
It integrates with a Django REST backend and features a responsive ReactJS web dashboard and a Flutter mobile app.

---

## 🧩 Features

- 🔥 Real-time gas (MQ2) monitoring from ESP32
- 🌐 RESTful API & WebSocket integration
- 📈 Visual PPM gauge and system status (Safe, Warning, Danger)
- 📊 Alert history log
- 🔒 JWT authentication and secured API access
- ☁️ Fully deployed (Render + GitHub + Firebase/Expo)

---

## 🚀 How to Run

### 1. Backend (Django + DRF)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


### 2. Frontend (Vite + ReactJS)

```bash
cd web
npm install
npm run dev


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

Shun Cyrel Caseres — Full Stack Developer (Frontend & Backend)
Faith Gutierrez — Technical Writer
Christine B. Sevilla — Frontend Developer
Jayrille Tubera — IoT Developer (ESP32 + MQ2)
