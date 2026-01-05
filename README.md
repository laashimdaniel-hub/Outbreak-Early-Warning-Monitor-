 Outbreak Early-Warning Monitor (OEWM)
Project Overview

The Outbreak Early-Warning Monitor (OEWM) is a full-stack web application designed to detect potential disease outbreaks earlier than traditional health surveillance systems.

Instead of relying solely on hospital or laboratory data (which often arrives late), OEWM analyzes simulated proxy data—such as reports of flu-like symptoms—to identify statistical anomalies that may signal emerging outbreaks.

The system ingests time-stamped and location-tagged data, calculates statistical baselines, detects abnormal spikes, and displays geographic alerts on an interactive dashboard for rapid situational awareness.
 Problem Statement

Traditional public health surveillance systems suffer from time delays caused by manual reporting and laboratory confirmation. These delays can slow down outbreak response and resource deployment.

Early warning signals often exist in non-clinical, unstructured data, but without automation, these signals remain unnoticed.

OEWM addresses this gap by providing a rapid, automated, and visual early-warning layer to flag unusual patterns for further investigation by public health officials.
Project Goals & Objectives

    Develop a data ingestion pipeline for simulated outbreak reports

    Implement statistical baseline calculation using historical data

    Detect anomalies using a simple threshold (mean + N standard deviations)

    Visualize alerts on a secure, interactive dashboard

    Highlight affected regions using geographic mapping

    Deliver a functional MVP within a 4-week timeline

Target Users

    Public Health Analysts – Continuous outbreak monitoring

    Emergency Response Coordinators – Rapid alert-based decision making

    Epidemiology Students & Researchers – Studying early-warning systems

Key Features

    User Authentication

        Secure sign-up and login using JWT authentication

    Simulated Data Ingestion

        Upload and process static CSV files containing outbreak reports

    Baseline Calculation

        Rolling statistical baseline (14-day mean and standard deviation)

    Anomaly Detection

        Alerts generated when values exceed mean + 2 × std

    Alerts Dashboard

        View active and historical alerts

    Geographic Visualization

        Map highlighting regions with detected anomalies

    Trend Analysis

        Charts comparing daily counts against baselines

System Architecture

Frontend (React)
│
│  REST API (JSON)
▼
Backend (Node.js + Express)
│
│  PostgreSQL
▼
Database

Technology Stack
Frontend

    React.js

    Mapbox GL JS (geographic visualization)

    Recharts (charts)

    Axios (API communication)

    Tailwind CSS (styling)

Backend

    Node.js

    Express.js

    JWT & bcrypt (authentication)

    CSV parsing (data ingestion)

    Custom statistical services

Database

    PostgreSQL

    Tables for:

        Users

        Raw reports

        Baselines

        Alerts

Database Schema (High Level)
Users

    id

    email

    password_hash

    created_at

Reports

    id

    date

    location_id

    report_count

Baselines

    location_id

    mean

    standard_deviation

    calculated_at

Alerts

    id

    location_id

    observed_value

    threshold

    status

    created_at

Alert Logic Specification
Baseline Calculation

For each geographic location:

Mean = average(report_count over last 14 days)
Standard Deviation = std(report_count over last 14 days)

Alert Threshold

Threshold = Mean + 2 × Standard Deviation

Alert Condition

If today's report_count > Threshold → Generate Alert

This logic ensures:

    Sensitivity to unusual spikes

    Reduced false positives

    Easy configurability

Seeded Data Structure

The system ingests static CSV files with the following structure:

date,location_id,report_count,latitude,longitude
2025-01-01,ZONE_A,12,4.0511,9.7679
2025-01-02,ZONE_A,15,4.0511,9.7679

Field Description

    date → Report date

    location_id → Geographic zone identifier

    report_count → Number of symptom reports

    latitude / longitude → Map coordinates

Frontend Structure

src/
├── components/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── AlertsTable.jsx
│   ├── AlertMap.jsx
│   ├── Charts.jsx
│
├── pages/
│   └── Dashboard.jsx
│
├── services/
│   └── api.js
│
└── App.js

Backend Structure

backend/
├── controllers/
├── services/
│   ├── baseline.service.js
│   ├── anomaly.service.js
├── routes/
├── middlewares/
├── config/
│   └── db.js
├── app.js
└── server.js

How to Run the Project Locally
1️Clone the Repository

git clone https://github.com/laashimdaniel-hub/Outbreak-Early-Warning-Monitor-.git
cd Outbreak-Early-Warning-Monitor-

2️Backend Setup

cd backend
npm install

Create a .env file:

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/oewm
JWT_SECRET=your_secret_key

Run backend server:

npm start

3️Frontend Setup

cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000

Deployment

    Backend deployed on Render

    Database hosted on PostgreSQL (Render)

    Frontend served via React production build

Live Application URL: https://outbreak-early-warning-monitor-1.onrender.com/
Project Timeline (4 Weeks)
Week 1 – Foundation

    Database schema design

    Authentication system

    Data ingestion API

Week 2 – Intelligence

    Baseline calculation

    Anomaly detection logic

    Alerts API

Week 3 – Visualization

    Alerts dashboard

    Map integration

    Alert history

Week 4 – Polish

    Charts & trend analysis

    Testing

    Deployment

Success Criteria

    Authorized users can log in

    Baselines are correctly calculated

    Anomalies generate alerts

    Geographic regions are accurately highlighted

Risks & Mitigations

False Positives

    Mitigated using conservative thresholds

Performance Issues

    Baselines pre-calculated and cached

Geo-Integration Complexity

    Simplified zone-based coordinates

Open Questions (Future Improvements)

    Configurable thresholds per region

    Manual alert confirmation/dismissal

    Finer data granularity (hourly data)

Authors

Laashim Daniel Tippi
Benjamin Senyo
Ulrich Brice Noutemgning Yimele
Nicholas Mwanza
License

This project is for educational and demonstration purposes.
