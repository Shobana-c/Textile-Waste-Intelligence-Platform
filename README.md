# Textile Waste Intelligence Platform (TexCycle)

TexCycle is an AI-powered Textile Waste Intelligence Platform that registers, scans, and optimizes textile recycling workflows. The platform leverages computer vision, material classification, and circular economy intelligence to estimate recyclability, predict fiber composition, identify damage or contaminants, and recommend sustainable reuse or recovery strategies.

---

## 🚀 Key Modules Implemented

1. **User Authentication & Role-Based Access (RBAC)**: Supports login and dashboard views tailored for operators, sustainability managers, manufacturers, and administrators.
2. **Textile Inventory Management**: Waste registration, tracking origin sources, quantity weights, colors, conditions, and collection datestamps.
3. **Textile Image Analysis & CV**: Upload fabric waste images, calculate dominant colors, and run edge-detection / texture variation checks (via OpenCV/Pillow) to predict material classification.
4. **Material Classification Engine**: Determines fiber makeup (Cotton, Polyester, Denim, Wool, Silk, Nylon, Blend, etc.) and blend ratios.
5. **Recycling Recommendation Engine**: Suggests recovery options (Fiber Recycling, Mechanical, Chemical, Upcycling, Donation, Industrial Recovery, or Disposal).
6. **ESG Footprint Offset Engine**: Computes CO₂ emissions avoided, water saved, landfill space diverted, and raw materials conserved.
7. **Circularity Scoring Engine**: Implements the weighted circularity formula:
   $$\text{Circularity Score} = 35\% \text{ Recyclability} + 20\% \text{ Condition} + 20\% \text{ Reuse Potential} + 15\% \text{ Sustainability} + 10\% \text{ Processing Feasibility}$$
8. **Dashboard & Analytics**: Custom role-specific charts displaying monthly diversion trends, composition distributions, and Circularity indexes.
9. **Reports & Export Center**: Streams on-the-fly downloads of detailed Excel sheets (`openpyxl`) and formatted Executive PDF reports (`reportlab`).

---

## 🛠️ Technology Stack

* **Backend**: Python 3.10+, FastAPI (Asynchronous API), SQLAlchemy ORM, SQLite (local zero-setup database).
* **Frontend**: React (JavaScript/ES6), Vite (build runner), Tailwind CSS (responsive layouts, modern glassmorphic design system), Lucide React.
* **AI/ML Processing**: Pillow (image processing), OpenCV (computer vision, feature/contrast analysis), NumPy.
* **Orchestration**: Docker & Docker Compose.

---

## 🔒 Pre-seeded Test Credentials

For easy testing, the system automatically pre-seeds the following test accounts on startup. The password for all accounts is: **`password123`**

| Role | Email Login | Purpose |
| :--- | :--- | :--- |
| **Recycling Facility Operator** | `operator@factory.com` | Batch registration, photo uploading, running AI scans |
| **Sustainability Manager** | `manager@sustainability.org` | Viewing CO₂/water offsets, ESG compliance, audits |
| **Textile Manufacturer** | `brand@fashion.com` | Production waste analysis, circular economy benchmarks |
| **System Administrator** | `admin@texcycle.com` | User management, complete system telemetry overview |

---

## 💻 Running the Project

### Option A: Running with Docker Compose (Recommended)
Make sure Docker is running on your system, then execute the following command in the project root folder:
```bash
docker-compose up --build
```
* **Frontend UI**: [http://localhost:3000](http://localhost:3000)
* **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Running Locally (Without Docker)

#### 1. Start the Backend
Navigate to the `backend` directory:
```bash
cd backend
```
Create a virtual environment and install packages:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```
Launch the API:
```bash
python run.py
```
*The backend API will run on [http://localhost:8000](http://localhost:8000).*

#### 2. Start the Frontend
In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The frontend React client will run on [http://localhost:3000](http://localhost:3000).*
