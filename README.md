# Payment Gap Analyzer
> An Enterprise-Grade Salary Equity & Compliance Analytics Platform for SMEs.

## 📌 Project Overview
The **Payment Gap Analyzer** is a comprehensive software solution engineered to help Small and Medium-sized Enterprises (SMEs) monitor, analyze, and correct internal salary discrepancies. Built to address modern regulatory compliance (e.g., EU pay transparency directives) and promote organizational equity, the system ingests raw HR data, processes it through statistical models, and visualizes actionable insights regarding gender, age, experience, and departmental pay gaps.

Unlike standard monolithic applications, this project demonstrates a modern, decoupled architecture by separating the web API gateway from the heavy data-processing analytics engine.

---

## 🏗️ Architecture & Technical Stack

The system utilizes a distributed 3-tier architecture, ensuring separation of concerns between user interface, business logic, and intensive data processing.

| Component / Layer | Technology | Engineering Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Material UI, PrimeReact | Responsive, component-based SPA delivering interactive data visualizations (Chart.js) and complex data tables. |
| **Backend Gateway** | Node.js, Express.js, JWT, Multer | Central API handling routing, secure authentication (2FA), file upload ingestion, and request validation. |
| **Analytics Engine** | Python, Django, Pandas | Dedicated microservice for processing large Excel datasets, cleaning data, and executing statistical algorithms. |
| **Database** | MySQL / MariaDB | Relational storage ensuring data integrity for employee records, organizational structures, and salary histories. |

---

## 🚀 Core Features & Engineering Highlights

### 1. Robust Data Ingestion Pipeline
* **Batch Processing:** Utilizes `Multer` on the Node.js gateway to securely receive multi-file Excel uploads.
* **Data Transformation:** Forwards raw files to the Python/Django service where `Pandas` is used to validate schemas, normalize edge cases (e.g., gender string variations), and persist clean data to the MySQL database.

### 2. Advanced Statistical Analytics
* **Dynamic Grouping:** Calculates mean, median, and standard deviation across dynamically selected cohorts (e.g., calculating average salary by gender partitioned by seniority brackets).
* **Interactive Dashboards:** Translates complex JSON datasets from the backend into responsive `Chart.js` visualizations (pie charts, stacked bars) directly in the browser.

### 3. Enterprise-Grade Security
* **Authentication:** Stateless authentication using JWT combined with Email-based Two-Factor Authentication (2FA) via `Nodemailer`.
* **Access Control:** Strict Role-Based Access Control (RBAC) isolating privileges between HR personnel, Managers, and System Administrators.
* **Threat Mitigation:** Implemented strict CORS policies, payload validation via `express-validator`, bcrypt password hashing, and API rate limiting to prevent brute-force and DDoS attacks.

---

## 📊 Sample Data Processing Flow

The following sequence illustrates how the system handles a complex reporting request without blocking the main thread:

1. **Client Request:** Authenticated HR user requests a "Gender Pay Gap by Seniority" report via the React UI.
2. **API Gateway:** Node.js intercepts the request, validates the JWT, and forwards the parameters to the Python Analytics Engine.
3. **Data Aggregation:** Django queries the MySQL database, utilizing aggregation functions (e.g., `ExtractYear`, `Avg`) to compute the exact statistical distribution.
4. **Data Delivery:** The structured payload is returned through the Node.js gateway to the React frontend, where it is instantly rendered into an interactive chart.

---

## ⚙️ Setup & Installation

**Prerequisites:** Node.js (v16+), Python (3.9+), MySQL Server.

### Backend (Node.js API) 
```bash
cd backend
npm install
npm run start
```

### Analytics Engine (Python/Django)
```bash
cd analytics
pip install -r requirements.txt
python manage.py runserver 8000
````

### Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
