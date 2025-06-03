# 🚀 Project Setup Guide
# 🛠️ Predictive Maintenance MVP for Manufacturing Units

This project is a working MVP for detecting **unplanned machine downtime** in **mid-sized manufacturing units** using real-time sensor data, predictive analytics, and a clean dashboard interface.

> ✅ **Deployed Version**: [LIVE DEMO LINK HERE] https://force-hackronyx-mvp-frontend.vercel.app/  
> _(Replace this with the actual deployed link once available)_

---

## 🌐 Project Overview

The system simulates real-time machine data using sensors such as:

- Torque sensors
- Vibration sensors (ADXL345)
- Current sensors (ACS712)
- Temperature sensors (DS18B20)
- Strain gauges (HX711)
- RPM (Hall Effect)
- Operating Hours (RTC + EEPROM)

The backend ingests the simulated data, stores it in a database, and provides APIs for the frontend dashboard to visualize and monitor machine health.

---

## 🚀 Technologies Used

| Layer         | Stack                          |
|--------------|---------------------------------|
| Frontend     | React, Tailwind CSS             |
| Backend      | Node.js, Express.js             |
| Database     | MongoDB                         |
| Simulator    | Python (Pandas, Requests)       |
| Deployment   | Vercel (Frontend, Backend), Render (Simulator Script) |

---

## 🧑‍💻 Running Locally (Developer Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/SaieshSharma/force-hackkronyx.git
cd force-hackkronyx

## ✅ Backend Setup

### Navigate to the server directory:
```bash
cd server
```

### Install dependencies:
```bash
npm install
```

> If facing any issues, try clearing cache and reinstalling:
```bash
npm ci
```

### Start the backend server:
```bash
npm run dev
```

Your backend server should now be running on **http://localhost:5000**.

## ✅ Frontend Setup

### Navigate to the frontend directory:
```bash
cd client
```

### Install dependencies:
```bash
npm install
```
> If you face issues with dependencies:
```bash
npm install --force
```

### Start the frontend server:
```bash
npm run dev
```

The frontend should now be running on **http://localhost:5173** (or as specified).


## Prerequisites
Before running these codes, install the required dependencies.

### Install Python
1. Download and install Python (version 3.8 or later) from the official website: [Python Downloads](https://www.python.org/downloads/)
2. During installation, check the box *"Add Python to PATH"*.

### Install Dependencies
Run the following command in your terminal or command prompt:
bash
pip install ultralytics opencv-python numpy matplotlib supervision google-generativeai

🔍 Key Features
Live sensor simulation with configurable delays
Real-time dashboard with live charts and warnings
Machine failure tracking
Torque, Temperature, Wear, Speed, Power visualization
Scalable architecture for multi-machine support

🧠 Future Improvements
Kafka-based message queuing for production-scale ingestion
ML-based failure prediction from historical data
Role-based access control for factory operators
Notification system (SMS/Email alerts)


