<center><h1># Locus API 🏢📍</h1></center>

<center><h2>Urban Feasibility Study Calculator - REST API</h2></center>

The **Locus API** is a RESTful API designed for the Architecture/Real Estate/Education sectors. Its primary objective is to calculate and provide the complete construction potential of urban lots based on municipal urban planning legislation. The API centralizes land use and occupation rules, enabling architects, investors, buyers, students, brokers, and real estate agencies to analyze lot construction feasibility in seconds.

![Badge Status](https://img.shields.io/badge/Status-Developing-yellow)
![Badge Node](https://img.shields.io/badge/Version-1.0.0-green)
![Badge Express](https://img.shields.io/badge/Maintained-Yes-green)
![Badge License](https://img.shields.io/badge/License-Proprietary-red)

---

## 🎯 Project Objective

Drastically reduce legislation consultation time and eliminate human errors in construction potential calculations. The system cross-references lot data (Area/Location) with database rules (Zoning) to generate instant reports through API endpoints.

---

## 🛠️ Technologies Used

This is a **REST API** backend project.

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **File Handling:** Multer (Profile picture uploads)
- **Architecture:** RESTful API

> **Note:** The frontend will be developed in a separate repository.

---

## ⚙️ API Features (Current Version)

### 🔐 Administrative Module (Backoffice)

- **Location Management:** CRUD operations for Cities and Urban Zones
- **Rules Management:** Define indexes (FAR - Floor Area Ratio, LCR - Lot Coverage Ratio) by Zone and Use Type
- **Use Management:** Register use types (Residential, Commercial, Industrial)

### 🏠 Client Module (Simulation)

- **Feasibility Calculation:** Automatic construction potential processing
- **Profile Management:** Profile picture upload (Single photo per user)

### 📐 Core Calculations

- **Built Area Calculation:** Total buildable area based
- **Footprint Calculation:** Maximum ground coverage based
- **Multi-use Support:** Different calculations for Residential, Commercial, and Industrial uses

---

## 🛡️ Security & Compliance (AppSec)

This project was developed following core **Secure by Design** principles:

- **Input Validation:** Strict data validation using **Yup** to prevent improper data injection.
- **Protection Headers:** Implementation of **Helmet** to secure HTTP headers against common vulnerabilities (XSS, Sniffing, etc).
- **Rate Limiting:** Application-layer protection against Brute Force and DoS attacks.
- **Secure Uploads:** Strict MIME-Type validation and file size limits to mitigate Remote Code Execution (RCE) risks.
- **Password Hashing:** Usage of **Bcrypt** with salting for secure credential storage.

---

## 📁 Project Structure

```
locus-api/
├── src/
│   ├── config/        # Database and environment configurations
│   ├── controllers/   # Request handlers
│   ├── models/        # Sequelize models
│   ├── routes/        # API routes
│   ├── middlewares/   # Custom middlewares
│   ├── services/      # Business logic
│   └── utils/         # Helper functions
├── uploads/           # User uploaded files
└── server.js          # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/eRodrigoVanini/locus-api.git

# Navigate to project directory
cd locus-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run migrations
npm run migrate

# Start development server
npm run dev
```

---

## 📡 API Documentation

API documentation will be available at `/api/docs` (Coming soon)

---

## 🚀 Future Enhancements

The following advanced features are planned for upcoming releases:

**Phase 2 - Advanced Analysis**

- 3D volumetric simulation and shadow analysis
- Automated setback and height validation
- Parking space requirement calculations
- Building height and bulk plane compliance checking

**Phase 3 - Geospatial Features**

- Interactive mapping (Leaflet/Mapbox integration)
- Address-based zone auto-detection
- City zoning map overlay layers
- Surroundings and amenities analysis

**Phase 4 - Documentation & Reports**

- PDF feasibility report generation
- Automatic descriptive memorial
- NBR-compliant area tables
- Multi-scenario comparisons

**Phase 5 - AI & Optimization**

- Intelligent building placement suggestions
- Permitted use comparisons
- Smart alert system for restrictions
- AI-driven optimal building recommendations

_Stay tuned for updates!_

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 👨‍💻 Author

**Rodrigo Vanini**

- GitHub: [@eRodrigoVanini](https://github.com/eRodrigoVanini)
