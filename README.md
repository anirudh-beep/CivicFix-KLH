CivicFix — Civic Issue Reporting Web Frontend
CivicFix is a civic issue reporting and repair-management platform. This repository contains the web frontend for two role-specific portals:
Citizen Portal — citizens report civic problems, attach photos, capture their location, track complaints, and verify completed repairs.
Repairman Portal — repairmen view assigned jobs, accept/start repairs, navigate to complaint locations, upload geo-tagged repair evidence, and control their daily work availability.
The frontend is designed so that the Django REST backend can be connected later without rewriting the page/UI layer.
---
1. Project Architecture
The project uses one shared codebase with two independent Vite applications:
```text
CivicFix Web
│
├── Citizen Web App
│   ├── Login / Register
│   ├── Dashboard
│   ├── New Report
│   ├── Complaint History
│   ├── Complaint Details
│   └── Profile
│
├── Repairman Web App
│   ├── Login / Register
│   ├── Dashboard
│   ├── Daily Log On / Log Off
│   ├── Active Tasks
│   ├── Completed Tasks
│   ├── Task Details
│   └── Profile
│
└── Shared
    ├── Authentication
    ├── Theme / Dark Mode
    ├── Navigation
    ├── API layer
    ├── Location services
    ├── Map components
    ├── Types
    ├── Utilities
    └── Common UI components
```
Current scope
Portal	Included
Citizen	Yes
Repairman	Yes
HOD	Backend/separate application
District Admin	Backend/separate application
The HOD and District Admin dashboards are intentionally outside this frontend repository.
---
2. Technology Stack
Only the technologies used by this project should be used when extending the frontend.
Frontend
React 19
TypeScript
Vite
React Router
Tailwind CSS
PostCSS
HTML5 / CSS
Browser APIs / frontend capabilities
Geolocation API
Camera / file upload APIs
Local Storage
EXIF metadata processing for geo-tagged evidence
Fetch API
Backend integration target
Django
Django REST Framework
JWT authentication
MySQL database
Groq API through the backend for AI classification
Maps/location services through the backend/frontend integration
The frontend does not contain the Groq secret key. AI provider credentials must remain on the backend.
Mobile conversion
The web application is also structured so the same workflows can later be implemented as Flutter screens by the mobile-development team.
---
3. Main Features
Citizen Portal
Authentication
Login
Registration
Role-aware authentication
Protected routes
Logout
Session/token handling
Citizen and repairman accounts are separated
Dashboard
Active complaints count
Resolved complaints count
Recent reports
Complaint status badges
Complaint location
New Report action
New Report
A citizen can:
Enter a complaint title.
Describe the problem.
Upload/take a photo.
Capture the current GPS location.
Receive an AI-suggested category.
Review/confirm the category.
Submit the complaint.
The intended workflow is:
```text
Take Photo
    ↓
Capture GPS Location
    ↓
Describe Problem
    ↓
AI Classification
    ↓
User Confirms Category
    ↓
Submit Complaint
```
Complaint tracking
Citizens can view:
Complaint title
Description
Category
Department
Priority
Location
Status
Original complaint photo
Repair evidence
Repair status
Repair verification
After a complaint is marked resolved, the citizen can verify whether the problem was actually fixed.
The intended verification choices are:
```text
Is the problem fixed?

YES → Confirm resolution
NO  → Report that the problem remains
```
---
4. Repairman Portal
Daily Log On / Log Off
Repairmen can choose whether they are available for work on a particular day.
The behavior is similar to delivery-partner availability systems.
```text
LOGGED OFF
    ↓
Not eligible for new assignments

LOGGED ON
    ↓
Available for new repair assignments
```
Important rule:
> Logging off should prevent **new assignments**, but it should not remove already assigned tasks.
The frontend currently stores the mock availability state locally.
When the Django backend is connected, availability must be enforced by the backend as well.
The backend is the final source of truth.
Dashboard
Displays:
Current work status
Log On / Log Off action
Active task count
Solved task count
Assigned tasks
Task priority
Task location
Assignment date
Current task status
Task details
Repairmen can see:
Complaint title
Original complaint photo
Description
Category
Department
Priority
Complaint location
Map
Navigation action
Assignment information
Repair completion
A repairman can:
Start/accept a repair.
Travel to the complaint location.
Complete the repair.
Capture an after-repair photo.
Attach GPS information.
Submit repair evidence.
Mark the task completed.
---
5. Geo-Tagged Repair Evidence
Repair completion requires location-aware evidence.
The supported paths are:
Option A — Live camera
```text
Open camera
    ↓
Capture repair photo
    ↓
Read GPS location
    ↓
Store location + accuracy + capture time
    ↓
Submit evidence
```
Option B — Existing geo-tagged JPEG
The uploaded image must contain:
GPS latitude
GPS longitude
Capture time
The frontend checks the available metadata before submission.
Evidence checks
The frontend can check:
Distance from complaint location
GPS accuracy
Capture timestamp
Whether the photo was captured after assignment
Whether the uploaded photo contains the expected metadata
The backend must repeat these checks.
Frontend validation is not a security boundary.
---
6. Theme System
CivicFix supports:
Light mode
Dark mode
Theme state is shared through the common theme context.
All major UI areas should respond to the selected theme:
Navbar
Dashboard
Cards
Forms
Inputs
Upload components
Complaint/task pages
Authentication pages
Status sections
Repairman Log On / Log Off panel
Maps and supporting UI
When adding a new component, do not hard-code only one theme.
Use the existing theme system and theme-aware styles.
---
7. Project Structure
```text
civic/
│
├── apps/
│   │
│   ├── citizen/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── App.tsx
│   │       ├── main.tsx
│   │       ├── portal.ts
│   │       ├── index.css
│   │       │
│   │       ├── pages/
│   │       │   ├── Dashboard.tsx
│   │       │   ├── NewReport.tsx
│   │       │   ├── History.tsx
│   │       │   ├── ComplaintDetails.tsx
│   │       │   └── Profile.tsx
│   │       │
│   │       ├── components/
│   │       │   ├── ComplaintCard/
│   │       │   ├── AIClassificationCard/
│   │       │   └── PhotoUploader/
│   │       │
│   │       ├── services/
│   │       │   ├── complaintService.ts
│   │       │   └── aiService.ts
│   │       │
│   │       └── utils/
│   │           └── validation.ts
│   │
│   ├── repairman/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── App.tsx
│   │       ├── main.tsx
│   │       ├── portal.ts
│   │       ├── config.ts
│   │       ├── index.css
│   │       │
│   │       ├── pages/
│   │       │   ├── Dashboard.tsx
│   │       │   ├── ActiveTasks.tsx
│   │       │   ├── CompletedTasks.tsx
│   │       │   ├── TaskDetails.tsx
│   │       │   └── Profile.tsx
│   │       │
│   │       ├── components/
│   │       │   ├── TaskCard/
│   │       │   └── GeoTagPhotoCapture/
│   │       │
│   │       ├── services/
│   │       │   ├── availabilityService.ts
│   │       │   ├── taskService.ts
│   │       │   └── evidenceCheck.ts
│   │       │
│   │       └── types/
│   │           ├── availability.ts
│   │           └── task.ts
│   │
│   └── ...
│
├── shared/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── components/
│   │   ├── AppLayout/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── ProtectedRoute/
│   │   ├── StatsCard/
│   │   ├── StatusBadge/
│   │   ├── LocationMap/
│   │   ├── GeoTagSummary/
│   │   └── ThemeToggle/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGeolocation.ts
│   │   └── useTheme.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── locationService.ts
│   │   ├── mapService.ts
│   │   └── mockData.ts
│   │
│   ├── types/
│   ├── utils/
│   └── config/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.shared.ts
├── postcss.config.js
├── .env.example
└── README.md
```
---
8. Installation
Requirements
Install:
Node.js
npm
Check installation:
```bash
node --version
npm --version
```
Install dependencies
From the project root:
```bash
npm install
```
Configure environment
Copy:
```text
.env.example
```
to:
```text
.env
```
Windows CMD:
```cmd
copy .env.example .env
```
PowerShell:
```powershell
Copy-Item .env.example .env
```
---
9. Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true
VITE_EVIDENCE_GEOFENCE_M=200
```
`VITE_API_BASE_URL`
Django REST API base URL.
Example:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```
`VITE_USE_MOCK`
Use:
```env
VITE_USE_MOCK=true
```
while developing the frontend without Django.
Use:
```env
VITE_USE_MOCK=false
```
after the Django backend is available.
`VITE_EVIDENCE_GEOFENCE_M`
Maximum permitted distance between:
complaint location
repair evidence location
Example:
```env
VITE_EVIDENCE_GEOFENCE_M=200
```
`0` means warn without blocking the submission.
The backend must still perform the final validation.
---
10. Running the Citizen Portal
Open Terminal 1:
```bash
npm run dev:citizen
```
Default URL:
```text
http://localhost:5173
```
If port 5173 is already being used:
```bash
npm run dev:citizen -- --port 5175
```
---
11. Running the Repairman Portal
Open Terminal 2:
```bash
npm run dev:repairman
```
Default URL:
```text
http://localhost:5174
```
If the port is occupied:
```bash
npm run dev:repairman -- --port 5176
```
---
12. Mock Accounts
When:
```env
VITE_USE_MOCK=true
```
the frontend can run without Django.
Citizen
```text
Email: citizen@civicfix.dev
Password: password123
```
Repairman
```text
Email: repairman@civicfix.dev
Password: password123
```
The portals validate the expected role.
Mock data is frontend-only and is not a replacement for the real database.
---
13. Build
Build both applications:
```bash
npm run build
```
Build only Citizen:
```bash
npm run build:citizen
```
Build only Repairman:
```bash
npm run build:repairman
```
Output:
```text
dist/
├── citizen/
└── repairman/
```
Type checking:
```bash
npm run typecheck
```
Linting:
```bash
npm run lint
```
Preview:
```bash
npm run preview:citizen
```
or:
```bash
npm run preview:repairman
```
---
14. Backend Integration
The frontend follows a service-layer architecture.
Pages should call:
```text
Page
 ↓
Service
 ↓
API helper
 ↓
Django REST API
 ↓
Database / AI / other backend services
```
Pages should not directly contain backend `fetch()` logic.
This allows the backend to be connected without redesigning the UI.
Authentication
Target endpoints:
```text
POST /api/auth/login/
POST /api/auth/register/
```
The response should contain the authenticated user's role.
Expected roles:
```text
CITIZEN
REPAIRMAN
```
The backend must enforce role permissions for every protected endpoint.
---
15. Complaint API
Target endpoints:
```text
GET    /api/complaints/
POST   /api/complaints/
GET    /api/complaints/{id}/
PATCH  /api/complaints/{id}/
POST   /api/complaints/{id}/verify/
```
Complaint creation should eventually support multipart form data so that the complaint photo can be uploaded together with the complaint information.
Typical complaint information includes:
```text
title
description
category
department
priority
latitude
longitude
photo
status
created_at
updated_at
```
---
16. Repairman API
Target endpoints:
```text
GET   /api/worker/tasks/
GET   /api/worker/tasks/{id}/
PATCH /api/worker/tasks/{id}/
```
Task status updates are sent through:
```text
PATCH /api/worker/tasks/{id}/
```
Example:
```json
{
  "status": "Completed"
}
```
---
17. Repairman Availability API
The daily Log On / Log Off feature should eventually use:
```text
GET  /api/worker/availability/
POST /api/worker/availability/
```
Suggested request:
```json
{
  "available": true
}
```
or:
```json
{
  "available": false
}
```
The backend must prevent a repairman who is currently offline from receiving a new assignment.
Existing assigned tasks should remain accessible.
---
18. Repair Evidence API
Target endpoint:
```text
PATCH /api/worker/tasks/{id}/
```
Content type:
```text
multipart/form-data
```
Expected fields:
Field	Description
`after_photo`	Repair evidence image
`status`	`Completed`
`geo_latitude`	Latitude
`geo_longitude`	Longitude
`geo_accuracy_m`	GPS accuracy
`geo_captured_at`	Capture timestamp
`geo_source`	`camera` or `photo-metadata`
The backend should return geo-tag information similar to:
```json
{
  "latitude": 17.4065,
  "longitude": 78.4772,
  "accuracyMeters": 12,
  "capturedAt": "2026-09-19T10:30:00Z",
  "source": "camera"
}
```
---
19. AI Classification
The citizen workflow is designed for AI-assisted complaint classification.
```text
Citizen photo + description
          ↓
      AI service
          ↓
Category
Department
Priority
          ↓
Citizen confirmation
          ↓
Submit complaint
```
Target frontend endpoint:
```text
POST /api/ai/classify/
```
The frontend must never expose a Groq API key.
Recommended architecture:
```text
React
  ↓
Django REST API
  ↓
Groq API
  ↓
AI result
  ↓
React
```
---
20. Maps and Location
CivicFix uses location information for:
Complaint reporting
Complaint maps
Repairman navigation
Geo-tag verification
Distance checks
The project contains shared location/map services so the implementation can be replaced or connected to the final map provider later.
Camera and browser geolocation generally require:
`localhost`, or
HTTPS
A plain HTTP LAN URL may prevent camera/GPS browser APIs from working.
---
21. Flutter Conversion
The web version is the first implementation.
The repairman/citizen mobile applications can later be implemented in Flutter using the same backend contracts.
Suggested mapping:
Web	Flutter
Citizen Dashboard	Citizen Dashboard screen
New Report	New Report screen
History	Complaint History screen
Complaint Details	Complaint Details screen
Repairman Dashboard	Repairman Dashboard screen
Active Tasks	Active Tasks screen
Task Details	Task Details screen
Completed Tasks	Completed Tasks screen
Profile	Profile screen
GeoTagPhotoCapture	`camera` + `geolocator`
LocationMap	`flutter_map`
API services	Dart API service layer
The Flutter application should use the same Django REST API rather than creating a second backend.
---
22. Important Development Rules
When adding features:
Keep Citizen and Repairman applications separate.
Put reusable functionality in `shared/`.
Keep API calls inside service files.
Do not put backend URLs directly inside UI components.
Do not expose AI provider API keys in React.
Keep role-based access enforced by the backend.
Keep both light and dark themes working.
Do not remove the Repairman Log On / Log Off workflow.
Existing assigned repair tasks must remain available even when a repairman logs off.
Keep geo-tag validation on the backend as well as the frontend.
Keep the frontend compatible with the planned Flutter implementation.
Use TypeScript for frontend code.
Do not introduce another frontend framework.
Do not replace React/Vite with another build system.
Test both Citizen and Repairman portals after UI changes.
---
23. Recommended Development Workflow
```text
1. Start Django backend when available
              ↓
2. Configure .env
              ↓
3. Start Citizen frontend
              ↓
4. Start Repairman frontend
              ↓
5. Test authentication
              ↓
6. Test complaint creation
              ↓
7. Test AI classification
              ↓
8. Test task assignment
              ↓
9. Test Repairman Log On / Log Off
              ↓
10. Test repair evidence
              ↓
11. Test citizen verification
              ↓
12. Test light/dark mode
              ↓
13. Run typecheck
              ↓
14. Run production build
```
---
24. Current Development State
The current frontend is designed as a backend-ready UI.
Currently available:
Citizen portal
Repairman portal
Shared authentication structure
Protected routes
Citizen complaint workflow
Complaint history
Complaint details
Repairman task workflow
Repairman daily availability
Log On / Log Off
Geo-tagged repair evidence workflow
Map/location UI
AI classification service interface
Light mode
Dark mode
Shared service/API layer
Mock mode for frontend development
Backend-dependent functionality should be switched from mock services to Django by setting:
```env
VITE_USE_MOCK=false
```
and implementing the corresponding Django REST endpoints.
---
25. Team Responsibilities
Suggested division:
Web Frontend
Citizen web portal
Repairman web portal
Responsive UI
Theme system
API integration
Frontend validation
Geo-tag UI
Backend
Django REST API
Authentication
JWT/session handling
MySQL database
Complaint management
Assignment system
Repairman availability enforcement
AI integration
Backend validation
File/image storage
Flutter
Citizen mobile application
Repairman mobile application
Camera integration
GPS integration
API integration
Mobile-specific UI
Admin/HOD
HOD dashboard
District Admin dashboard
Assignment/monitoring workflows
Analytics and reporting
---
26. Security Notes
Do not treat frontend validation as a security mechanism.
The Django backend must enforce:
Authentication
Authorization
Role permissions
Complaint ownership
Task ownership
Repairman availability
Assignment rules
Geo-tag validation
File validation
AI request authorization
Rate limiting where required
Never store:
Groq API keys
Database credentials
Django secret keys
Other private backend credentials
inside the React/Vite frontend.
Only public frontend configuration should use `VITE_*` variables.
---
27. License / Project Status
CivicFix is a project application currently under development.
The frontend is being built as the web foundation before the corresponding Flutter mobile applications and Django backend integration are completed.
