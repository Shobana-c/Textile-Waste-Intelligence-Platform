# TexCycle: Enterprise Textile Waste Circularity Portal

### 🎓 Infosys Springboard Virtual Internship Capstone Project

TexCycle is a state-of-the-art enterprise Circular Economy SaaS portal designed to automate textile waste identification, circularity scoring, and resource conservation analytics. 

It implements an **AI-powered image analysis loop** to classify fabrics and extract color palettes, calculates a custom **Weighted Circularity Index**, tracks **ecological offsets** (carbon emissions avoided and water footprints saved), and packages the entire suite for production using a unified **Docker Compose reverse-proxy Nginx framework**.

---

## 🚀 Key Features

*   **⚡ AI-Powered Weave & Color Classifier**: Uses simulated CNN detectors to classify textile types and implements Pillow Lanczos pixel clustering to extract a 3-color palette (dominant, secondary, and accent) from fabric photos.
*   **📐 Weighted Circularity Score Matrix**: Computes fabric recovery rates based on physical recyclability, moisture/contamination coefficients, and reuse potential.
*   **📊 Sustainability Intelligence Dashboard**: Renders interactive SVG charts detailing fabric distribution weight, land-fill diversion records, and CO2/water conservation metrics.
*   **📥 Enterprise Report Exporters**: Supports instant CSV downloads of inventory logs and a CSS media-print stylesheet for generating PDF executive summaries.
*   **🐳 Multi-Stage Docker Containerization**: Configured with automated Nginx reverse-proxies to serve React static bundles and tunnel `/api/` endpoints to the FastAPI backend.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Tailwind CSS, Lucide icons, ES6 Modules |
| **Backend** | FastAPI (Python 3.12+) | Pillow (Imaging), SQLAlchemy (ORM), Uvicorn |
| **Database** | SQLite | SQLite3 relational engine |
| **Proxy Gateway** | Nginx | Reverse proxy, static asset compression |
| **Containerization** | Docker | Docker Compose multi-service build |

---

## 📐 Scientific Formulation Matrix

### 1. Weighted Circularity Score (WCS)
The system calculates a circularity index of each textile batch based on 5 parameters:
$$\text{Circularity} = (0.35 \times R) + (0.20 \times C) + (0.20 \times P_r) + (0.15 \times E_b) + (0.10 \times F_e)$$

Where:
*   **$R$ (Recyclability Score)**: Direct chemical/physical breakdown capacity of the fiber.
*   **$C$ (Condition Coefficient)**: Dynamic multiplier mapping contamination (Clean = 100%, Damaged = 50%, Contaminated = 15%).
*   **$P_r$ (Reuse Potential)**: Adaptability for upcycling based on composition.
*   **$E_b$ (Environmental Benefit)**: Carbon offset capability of natural vs synthetic materials.
*   **$F_e$ (Processing Feasibility)**: Chemical complexity required to recycle the weave.

### 2. Environmental Offset Math
The portal evaluates raw ecological savings compared to standard crop/fabric replacement models:
*   **CO2 Saved (kg)**:
    $$\text{CO2 Saved} = \text{Quantity (kg)} \times \text{Material Multiplier} \quad \text{[Cotton: 2.6, Wool: 2.6, Denim: 2.2, Synthetics: 1.8]}$$
*   **Water Footprint Saved (Liters)**:
    $$\text{Water Saved} = \text{Quantity (kg)} \times \text{Water Index} \quad \text{[Cotton: 20,000L, Denim: 9,000L, Wool: 5,000L, Synthetics: 100L]}$$

---

## 📂 Project Repository Directory Layout

```txt
textile-waste-platform/
├── backend/
│   ├── app/
│   │   ├── analysis.py       # Color extraction and simulated CNN model
│   │   ├── database.py       # SQLite connection parameters
│   │   ├── main.py           # FastAPI routes and middleware
│   │   ├── models.py         # SQLAlchemy DB schemas
│   │   └── schemas.py        # Pydantic validation structures
│   ├── Dockerfile            # Backend production container configuration
│   └── requirements.txt      # Python library dependencies
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT user storage and session manager
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Dynamic reports and inventory grids
│   │   │   ├── Login.jsx     # User authentication interface
│   │   │   └── Register.jsx  # Sign-up system with credential manager
│   │   ├── App.jsx           # React app router config
│   │   ├── index.css         # Glassmorphism, animations and print-media styles
│   │   └── main.jsx          # DOM entry binder
│   ├── Dockerfile            # Multi-stage React node builder
│   ├── nginx.conf            # Nginx proxy-pass routing configuration
│   └── package.json          # Node script commands and package requirements
├── docker-compose.yml        # Multi-container orchestrator config
└── README.md                 # Project details & submission outline
```

---

## ⚡ Setup & Run Instructions (Local)

### 🐍 Backend Service Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Linux/Mac:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Launch the FastAPI server:
    ```bash
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
    ```

### ⚛️ Frontend Service Setup
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install package dependencies:
    ```bash
    npm install
    ```
3.  Launch the Vite React dev server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to: [http://localhost:5173/](http://localhost:5173/)

---

## 🐳 Docker Deployment Guide

To run the entire platform as a unified containerized service:

1.  Ensure you have **Docker Desktop** installed.
2.  Open a terminal in the project root directory containing `docker-compose.yml`.
3.  Run the orchestration command:
    ```bash
    docker compose up -d --build
    ```
4.  The system will compile, bundle the frontend assets, reverse proxy ports, and expose the complete platform on:
    *   **Main Application**: [http://localhost/](http://localhost/)
