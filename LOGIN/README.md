# CareBridge Common Unified Login Portal

[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Standard-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Port](https://img.shields.io/badge/Port-3000-blueviolet?style=flat-square)](http://localhost:3000)

The **CareBridge Common Login Portal** is the centralized, secure authentication gateway for all administrative and operational healthcare personnel across the CareBridge ecosystem. Operating on **Port 3000**, it eliminates fragmented login screens by providing a single point of credential verification connected directly to the Express backend.

---

## 1. Authentication Flow & Role Redirection

When a user submits credentials on the Common Login portal:
1. The frontend dispatches a secure request to `POST http://localhost:5000/api/auth/login`.
2. The backend validates credentials using `bcryptjs` and returns a server-signed JSON Web Token (JWT) containing the user's authoritative claims (`role`, `district`, `hospitalId`).
3. The portal executes an automatic, seamless cross-origin redirection based on the authenticated role:

```
                               ┌────────────────────────────────────────────────────────┐
                               │           CareBridge Common Login Portal               │
                               │                http://localhost:3000                   │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                                POST /api/auth/login
                                                          │
                                                          ▼
                                      ┌───────────────────────────────────────┐
                                      │        Node.js REST API (:5000)       │
                                      │         Issues Server-Signed JWT      │
                                      └───────────────────┬───────────────────┘
                                                          │
                                  Role-Based Redirection with Token Parameter
                                                          │
             ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
             ▼                                            ▼                                            ▼
┌─────────────────────────┐                  ┌─────────────────────────┐                  ┌─────────────────────────┐
│     Master Admin        │                  │   Government Health     │                  │   Hospital Operations   │
│      (Port 5173)        │                  │      (Port 5174)        │                  │       (Port 5175)       │
├─────────────────────────┤                  ├─────────────────────────┤                  ├─────────────────────────┤
│ • ADMIN                 │                  │ • STATE_ADMIN           │                  │ • HOSPITAL_ADMIN        │
│                         │                  │ • DISTRICT_ADMIN        │                  │ • DOCTOR                │
│                         │                  │ • GOVERNMENT            │                  │ • NURSE                 │
│                         │                  │                         │                  │ • RECEPTIONIST          │
│                         │                  │                         │                  │ • LAB_STAFF             │
│                         │                  │                         │                  │ • PHARMACIST            │
│                         │                  │                         │                  │ • BILLING_STAFF         │
│                         │                  │                         │                  │ • RECORDS_STAFF         │
│                         │                  │                         │                  │ • EMERGENCY_STAFF       │
│                         │                  │                         │                  │ • HR_MANAGER            │
└─────────────────────────┘                  └─────────────────────────┘                  └─────────────────────────┘
```

---

## 2. Token Security & History Sanitization

- **Cross-Port Delivery**: Tokens are initially transmitted to destination dashboards via secure URL parameters (`?token=<JWT>`).
- **Immediate History Sanitization**: Destination dashboards immediately persist the token in browser storage (`localStorage` / `sessionStorage`) and strip the token parameter from the URL using:
  ```javascript
  window.history.replaceState({}, document.title, window.location.pathname);
  ```
- **Zero Mock Bypasses**: Local mock authentication fallbacks have been removed in favor of strict, authoritative PostgreSQL validation.

---

## 3. Fast Evaluator Demo Credentials

The portal features convenient **demo role pills** allowing evaluators and reviewers to autofill validated credentials with a single click:

| Role Category | Role Name | Identifier | Password | Destination Dashboard |
|---|---|---|---|---|
| **System Admin** | Master Admin | `admin@carebridge.local` | `Admin@123` | `http://localhost:5173` |
| **Government** | Health Administrator | `government@carebridge.local` | `Gov@123` | `http://localhost:5174/dashboard` |
| **Hospital** | Hospital Admin | `hospital.admin@carebridge.local` | `Admin@123` | `http://localhost:5175/admin/dashboard` |
| **Hospital** | Doctor | `doctor@carebridge.local` | `Doctor@123` | `http://localhost:5175/doctor/dashboard` |
| **Hospital** | Nurse | `nurse@carebridge.local` | `Nurse@123` | `http://localhost:5175/nurse/dashboard` |
| **Hospital** | Receptionist | `receptionist@carebridge.local` | `Reception@123` | `http://localhost:5175/receptionist/dashboard` |
| **Hospital** | Laboratory Technician | `lab@carebridge.local` | `Lab@123` | `http://localhost:5175/lab/dashboard` |
| **Hospital** | Pharmacist | `pharmacist@carebridge.local` | `Pharmacy@123` | `http://localhost:5175/pharmacy/dashboard` |
| **Hospital** | Billing Officer | `billing@carebridge.local` | `Bill@123` | `http://localhost:5175/billing/dashboard` |
| **Hospital** | Medical Records | `records@carebridge.local` | `Record@123` | `http://localhost:5175/records/dashboard` |
| **Hospital** | Emergency Staff | `emergency@carebridge.local` | `Emerg@123` | `http://localhost:5175/emergency/dashboard` |
| **Hospital** | HR Manager | `hr@carebridge.local` | `Hr@123` | `http://localhost:5175/hr/dashboard` |

---

## 4. Setup & Running

The Common Login portal is served via a lightweight Node.js HTTP server:

```bash
# From repository root:
node scripts/serve-login.js
# or:
npm run dev:login
```

Access the portal in your browser at: **[http://localhost:3000](http://localhost:3000)**.

