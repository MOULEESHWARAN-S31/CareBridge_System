# CareBridge Patient Mobile & Web Application

[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev/)
[![Dart](https://img.shields.io/badge/Dart-3.3%2B-0175C2?style=flat-square&logo=dart&logoColor=white)](https://dart.dev/)
[![Flutter Tests](https://img.shields.io/badge/Flutter%20Tests-120%2F120%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Flutter Analyze](https://img.shields.io/badge/Flutter%20Analyze-0%20Issues-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Languages](https://img.shields.io/badge/Localization-23%20Languages-orange?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![ABDM / ABHA](https://img.shields.io/badge/ABDM%20%2F%20ABHA-Compliant-FF9933?style=flat-square)](https://abdm.gov.in/)

The **CareBridge Patient App** is a citizen-first mobile and web application engineered to bridge the gap between rural and urban communities and the public healthcare infrastructure. Built with Flutter, it delivers seamless Ayushman Bharat Digital Mission (ABDM) integration, multilingual accessibility across 23 languages, digital OPD queue tokens, personal health records (PHR), and emergency medical SOS dispatch.

---

## 1. Key Capabilities & Features

### 🆔 Ayushman Bharat Health Account (ABHA / ABDM) Integration
- **Mobile Number Discovery**: Instant lookup of existing ABHA profiles associated with a citizen's mobile number.
- **Family Unit Management**: Supports multi-profile linking under a single mobile number (Self, Spouse, Children, Elderly Parents).
- **New ABHA Creation**: Guided digital onboarding flow generating verifiable 14-digit ABHA numbers (e.g., `12-3456-7890-1234`) and QR cards.
- **ABHA Address / PHR Address**: Generates interoperable health handles (e.g., `ramesh.kumar@abdm`).

### 🌐 23-Language Multilingual Localization Engine
The application houses an inclusive multilingual localization engine catering to linguistic diversity across Indian states:
- **Languages Supported**: English, Tamil (தமிழ்), Hindi (हिंदी), Telugu (తెలుగు), Malayalam (മലയാളം), Kannada (ಕನ್ನಡ), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Assamese (অসমীয়া), Urdu (اردو), and 10 additional regional dialects.
- Dynamic runtime language switching without requiring application restart.

### 🏥 Facility Discovery & OPD Appointment Booking
- **GPS-Assisted Facility Locator**: Finds nearby Government District Hospitals, Taluk Hospitals, Community Health Centers (CHCs), and Primary Health Centers (PHCs).
- **Specialist & Doctor Scheduling**: Real-time calendar slot booking by department (General Medicine, Pediatrics, Orthopedics, Obstetrics, Cardiology, etc.).
- **Digital OPD Token & Pass**: Generates scannable OPD passes with QR codes, reducing physical queues and triage delays.

### ⏱️ Real-Time Queue & Token Tracking
- Live token tracking showing current number being served, estimated waiting time, and consultation room numbers.
- Push and in-app notifications alerting patients when their token is within 3 positions of being called.

### 📑 Personal Health Records (PHR / FHIR Compliant)
- Secure repository for digital prescriptions, laboratory test reports, immunization history, and doctor consultation summaries.
- One-click prescription medicine ordering with mapped government pharmacies.

### 🚨 Emergency SOS & Fast Triage
- One-touch emergency SOS triggering immediate SMS dispatch to registered emergency contacts with GPS coordinates.
- Direct dialing to 108 Emergency Ambulance, Women's Helpline, and District Hospital Emergency casualty wards.

### 📶 Offline-First Architecture & Sync Queue
- SQLite-backed local storage ensuring critical patient profile information, upcoming appointments, and emergency medical IDs remain accessible without active cellular data.
- Queued actions automatically synchronize with the central backend upon network restoration.

---

## 2. ABDM Verification Test Accounts

The backend database includes pre-seeded profiles covering all mandatory ABDM compliance test cases:

| Mobile Number | Profiles Returned | Expected Behaviour & Test Case |
|---|---|---|
| `9876500000` | **0 Profiles** | Unregistered mobile $\rightarrow$ Initiates New ABHA Registration Flow |
| `9876500001` | **1 Profile** | Individual profile (`12-3456-7890-1234` — Ramesh Kumar) |
| `9876500002` | **2 Profiles** | Family Unit: Self + Spouse profile selection |
| `9876500003` | **3 Profiles** | Nuclear Family: Self + Spouse + Child selection |
| `9876500004` | **4 Profiles** | Joint Family: Parents, Self, Spouse, Child |
| `9876543210` | **2 Profiles** | Multi-profile general evaluation account |

---

## 3. Architecture & Directory Layout

```
CARE_BRIDGE/
├── pubspec.yaml                         # Flutter dependencies & assets
├── lib/
│   ├── main.dart                        # App entry point, MultiProvider & theme
│   ├── core/
│   │   ├── config/                      # API endpoints & environment constants
│   │   ├── localization/                # 23-language string tables & locale provider
│   │   ├── network/                     # HTTP client, interceptors & error handler
│   │   ├── services/                    # ApiService, StorageService, AbhaService
│   │   └── theme/                       # Design tokens, typography & accessible palettes
│   └── features/
│       ├── abha/                        # ABHA lookup, verification & registration screens
│       ├── appointments/                # Facility search, doctor picker & slot booking
│       ├── home/                        # Citizen home dashboard & quick service cards
│       ├── records/                     # PHR records, lab reports & prescriptions
│       ├── queue/                       # Live OPD token tracking
│       ├── emergency/                   # SOS emergency trigger & facility locator
│       └── profile/                     # Health ID card, language picker, settings
└── test/                                # 120 automated unit, widget & integration tests
```

---

## 4. Setup, Run & Build

### Prerequisites
- Flutter SDK (v3.19.0+)
- Dart SDK (v3.3+)
- Android Studio / VS Code with Flutter Extension
- Google Chrome (for Flutter Web development)

### Install Dependencies
```bash
flutter pub get
```

### Run on Web (Port 8080)
```bash
flutter run -d chrome --web-port=8080
```

### Run on Android Device / Emulator
```bash
flutter run -d android
```

### Build Production Android APK
```bash
flutter build apk --release
```

### Build Production Web Application
```bash
flutter build web --release
```

---

## 5. Automated Test Suites & Quality Assurance

The application features comprehensive test suites validating business logic, UI rendering, accessibility scaling, and multi-language strings:

```bash
flutter test
```

**Results: 120/120 PASSED (0 failures)**

### Static Code Analysis
```bash
flutter analyze
```
**Results: 0 issues found! Clean codebase.**
