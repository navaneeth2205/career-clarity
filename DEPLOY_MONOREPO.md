Monorepo deployment layout
- Frontend folder: career-clarity-main
- Backend folder: career-clarity-backend

Backend deployment on Render
1) Push this repo to GitHub.
2) In Render, create Blueprint from this repo root (it will pick render.yaml).
3) Set required secret env vars in Render dashboard:
   - SECRET_KEY
   - POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST
   - ALLOWED_HOSTS
   - CORS_ALLOWED_ORIGINS
   - CSRF_TRUSTED_ORIGINS
   - OPENROUTER_API_KEY (if used)
   - GOOGLE_CLIENT_ID (if Google auth used)
   - EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, DEFAULT_FROM_EMAIL
4) Deploy service.
5) Create superuser once from Render shell:
   python manage.py createsuperuser

Frontend deployment on Vercel
1) Import the same GitHub repo in Vercel.
2) Set Root Directory to career-clarity-main.
3) Add env var in Vercel project:
   VITE_API_URL=https://<your-render-backend-domain>/api
4) Deploy.

Important
- Keep DEBUG=False in production.
- Never commit real credentials in .env files.
- If CORS/CSRF errors occur, verify frontend URL is included in both CORS_ALLOWED_ORIGINS and CSRF_TRUSTED_ORIGINS.
