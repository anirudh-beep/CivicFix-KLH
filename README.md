# CivicFix — Civic Complaint Lifecycle Platform

CivicFix is a full-stack, four-role civic-complaint lifecycle platform:
**Citizen** → **AI classify** → **HOD assign** → **Repairman resolve** → **Citizen verify** → **HOD approve** → **District dashboard**.

The platform is powered by a unified **Django REST Framework** backend, single reconciled **MySQL** database schema, session-based cookie authentication, and three **React + TypeScript + Vite** frontend applications.

---

## 1. Project Structure

```text
KLH HACK @/
├── backend/                       # Unified Django REST Framework backend
│   ├── civicfix/                  # Settings, URLs, WSGI configuration
│   ├── authentication/            # Custom User model, session auth, roles
│   ├── complaints/                # Complaints, categories, departments, SLA configs
│   ├── repairs/                   # Assignments, repair attempts, evidence & geo-verification
│   ├── activities/                # Activity audit log, escalations, department reports
│   ├── notifications/             # Notification engine & safe notify helpers
│   ├── ai/                        # Groq AI classifier with timeout & keyword fallback
│   ├── tests/                     # Comprehensive test suite covering all lifecycle flows
│   ├── Procfile & railway.json    # Railway production deployment configurations
│   ├── manage.py
│   └── requirements.txt
├── web-frontend/                  # Citizen & Repairman monorepo (Vite + React)
│   ├── apps/citizen/              # Citizen reporting & verification portal
│   ├── apps/repairman/            # Repairman active tasks & completion evidence portal
│   └── shared/                    # Shared session auth, API layer, mappers
├── civicfix-hod/                  # Standalone HOD portal (Vite + React)
└── civicfix-admin/                # Standalone District Admin portal (Vite + React)
```

---

## 2. Technology Stack & Key Decisions

- **Backend**: Python 3.12, Django 4.2+, Django REST Framework.
- **Authentication**: Django `SessionAuthentication` with secure cookies (`credentials: "include"`) and CSRF protection. No auth tokens in `localStorage` or `sessionStorage`.
- **Database**: Single reconciled schema for MySQL (via `PyMySQL` driver compatible with Railway MySQL) with local fallback support.
- **AI Classification**: Groq API (`llama-3.3-70b-versatile` / vision) with a 5-second timeout and automatic keyword triage fallback so complaint creation never hangs or fails.
- **Authoritative Business Rule**: Ported from `workflowService.ts` to `backend/complaints/services.py`:
  A complaint reaches `RESOLVED` **only** when, for the current repair attempt:
  1. Evidence has been submitted (`resolution_status != 'NOT_SUBMITTED'`)
  2. `citizen_verification == 'APPROVED'`
  3. `hod_verification == 'APPROVED'`
  Neither citizen nor HOD alone can resolve a complaint, and repairmen can never directly mark it resolved.
- **Rework Cycles**: Preserves previous attempt history and initializes a clean, incremented `RepairAttempt` (attempt #2, #3, etc.) setting the status to `REWORK_REQUIRED`.
- **Duplicate Detection**: Flags near-duplicate open complaints in the same category within 300 meters and 14 days.

---

## 3. Demo / Seed Accounts

Shared password for all demo accounts: **`password123`**

| Role | Email | Description |
|---|---|---|
| **Citizen** | `citizen@civicfix.dev` | File reports, attach photos, verify completed repairs |
| **Repairman** | `repairman@civicfix.dev` | View assigned tasks, start work, upload completion evidence |
| **HOD** | `sunita.verma@civicfix.gov` | Head of Roads & Sanitation: assign workers, approve repairs, request rework |
| **District Admin** | `arjun.mehta@civicfix.gov` | District-wide metrics, SLA escalations, departments, audit trail |

---

## 4. Local Setup & Running

### Backend Setup

```bash
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Run database migrations
python manage.py migrate

# Seed demo users, categories, departments, and lifecycle complaints
python manage.py seed_civicfix

# Run backend test suite
python manage.py test tests

# Start Django development server (runs on port 8000)
python manage.py runserver
```

### Frontend Applications Setup

All three frontend applications are pre-configured to connect to `http://localhost:8000/api` with `VITE_USE_MOCK=false`.

#### 1. Citizen & Repairman Monorepo (Ports 5173 & 5174)
```bash
cd web-frontend
npm install
npm run dev
# Citizen Portal:   http://localhost:5173
# Repairman Portal: http://localhost:5174
```

#### 2. HOD Portal (Port 5175)
```bash
cd civicfix-hod
npm install
npm run dev
# HOD Portal:       http://localhost:5175
```

#### 3. District Admin Portal (Port 5176)
```bash
cd civicfix-admin
npm install
npm run dev
# Admin Portal:     http://localhost:5176
```

---

## 5. Production Deployment

### Railway (Backend + MySQL)
1. In Railway, provision a **MySQL Database**.
2. Connect the GitHub repository and set the root directory to `backend`.
3. Add environment variables in Railway:
   - `DATABASE_URL`: Automatically populated by Railway MySQL
   - `DJANGO_SECRET_KEY`: Production secret key
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `.railway.app,your-domain.com`
   - `CORS_ALLOWED_ORIGINS`: `https://citizen.your-domain.com,https://hod.your-domain.com,https://admin.your-domain.com`
   - `CSRF_TRUSTED_ORIGINS`: `https://*.railway.app,https://*.vercel.app`
   - `GROQ_API_KEY`: Your Groq API key
4. Railway will automatically execute `railway.json` which runs `migrate`, `seed_civicfix`, and starts `gunicorn`.

### Vercel (Frontends)
Deploy each frontend directory (`web-frontend`, `civicfix-hod`, `civicfix-admin`) as independent Vercel projects or sub-projects with:
```bash
VITE_API_BASE_URL=https://your-backend.railway.app/api
VITE_USE_MOCK=false
```
