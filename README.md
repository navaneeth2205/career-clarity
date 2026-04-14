# Career Clarity 🚀

Career Clarity is a full-stack web application designed for comprehensive career guidance, offering users intuitive tests, powerful recommendations, and proactive opportunity alerts.

## Architecture

This project is organized as a monorepo consisting of:
- **`career-clarity-main/`**: The Frontend, built primarily with React, Vite, Tailwind CSS, and Axios.
- **`career-clarity-backend/`**: The Backend, built with Django, equipped with robust integrations, APIs, and specialized modules.

---

## 🚀 Deployment Instructions

### Backend Deployment (Render)
1. Push this monorepo to GitHub.
2. In Render, create a Blueprint from this repo's root (it will automatically pick `render.yaml`).
3. Set the following required secret environment variables in the Render dashboard:
   - `SECRET_KEY`
   - `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`
   - `ALLOWED_HOSTS`
   - `CORS_ALLOWED_ORIGINS`
   - `CSRF_TRUSTED_ORIGINS`
   - `OPENROUTER_API_KEY` (if used)
   - `GOOGLE_CLIENT_ID` (if Google auth used)
   - `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`
4. Deploy the service.
5. Create a superuser once from the Render shell:
   ```bash
   python manage.py createsuperuser
   ```

### Frontend Deployment (Vercel)
1. Import the same GitHub repo in Vercel.
2. Set the Root Directory to `career-clarity-main`.
3. Add the following environment variable in the Vercel project:
   `VITE_API_URL=https://<your-render-backend-domain>/api`
4. Deploy.

**Important Deployment Notes**:
- Keep `DEBUG=False` in production.
- Never commit real credentials in `.env` files.
- If CORS/CSRF errors occur, verify the frontend URL is included in both `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.

---

## 🛠️ Advanced Modules & Features

### 1. Test Page Implementation (`career-clarity-main`)

A robust React frontend component suite orchestrating career guidance tests with stringent security constraints and seamless transitions.

**Dynamic Flow**:
Checks `GET /api/test/quick/` to navigate the user to either the Quick Test or the Skill Test, followed seamlessly by the Result Page.

**Quick Test Features**:
- 8 questions with multi-choice and timer (30 mins). Auto-submits on completion.

**Skill Test Features**:
- **Security Protocols**: 
  - ✅ **Fullscreen mode enforced**
  - ✅ **Copy/Paste disabled**
  - ✅ **Right-click disabled**
  - ✅ **Tab switching detection & warning**
- 15 skill-based questions with a 45-minute countdown.

**Result Display**:
- Automatically categorizes users into three tiers (🌱 Beginner, 📈 Intermediate, 🚀 Advanced).
- Generates dynamic career recommendations and AI-assisted capability insights from `GET /api/predict/`. 

*Refer to the frontend source under `src/pages/TestPage.jsx` and `src/pages/TestResultPage.jsx` for granular integration details.*

---

### 2. Alerts System Implementation (`career-clarity-backend`)

The fully integrated, API-driven Alerts module tracks and routes relevant opportunities directly to users. 

**Module Details (`alerts_module/`)**:
Ingests data automatically using specialized fetchers via `requests` and `beautifulsoup4`:
- **Internshala Fetcher**: Scrapes ~20 internship entries iteratively logic.
- **Scholarships Fetcher**: Pulls from `scholarships.gov.in` and auto-levels users (`10 / 12 / UG`).
- **Jobs Fetcher**: Queries Indeed for entry-level tasks.
- *Fallback safety logic enabled across all fetchers ensuring zero system crashes on timeouts.*

**Data Processing & API**:
- **Endpoint**: `GET /api/alerts/` (JWT Authenticated)
- Automatically assesses users based on extracted CV `tools` and `class_level`, scoring them by interest overlap (+5) and skill sets (+3). 
- Top opportunities are labeled under "recommended".

**How to run fetchers manually (Django Shell)**:
```python
from alerts_module.run_fetchers import run_all_fetchers
run_all_fetchers() 
# Success Output: {'internshala': 20, 'scholarships': 10, 'jobs': 2}
```

---

*This README manages the architecture overview and has consolidated the historically segregated TEST_PAGE_IMPLEMENTATION, ALERTS_SYSTEM, and DEPLOY instructions into a single point of truth.*
