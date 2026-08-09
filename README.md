# caroline.is-a.dev

Personal site, rebuilt as a bento-grid dashboard.

- **frontend/** — React + TypeScript + Tailwind CSS v4 + shadcn/ui (Vite), routed with react-router
- **backend/** — FastAPI serving projects, skills and a contact form endpoint (SQLite)

The frontend works on its own (it falls back to local content in
`frontend/src/data/fallback.ts` if the API isn't reachable), so you don't
need the backend running just to browse the site. Run it too if you want
live data editing and the contact form to actually persist messages.

## Quick start

**Frontend**

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

**Backend** (optional, for live data + working contact form)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

With both running, `npm run dev`'s Vite server proxies `/api/*` to
`localhost:8000` automatically (see `frontend/vite.config.ts`).

## Editing content

- Projects: `backend/app/data/projects.py`
- Skill groups: `backend/app/data/skills.py`
- Social links: `backend/app/data/socials.py`

If you're not running the backend, edit the matching arrays in
`frontend/src/data/fallback.ts` instead — that's what renders when the API
isn't reachable.

Icons and photos live in `frontend/src/assets/icons` and
`frontend/src/assets/images`, re-exported from `index.ts` in each folder.

## Deployment

- The frontend is a static build (`npm run build` → `frontend/dist`) and can
  deploy to GitHub Pages like before — `frontend/public/CNAME` carries the
  custom domain into the build output.
- The backend needs a process host (Render, Railway, Fly.io, etc.) since
  GitHub Pages only serves static files. Once deployed, set
  `VITE_API_BASE_URL` (see `frontend/.env.example`) to its URL before
  building the frontend, and set `ALLOWED_ORIGINS` (see
  `backend/.env.example`) on the backend to allow the deployed frontend
  origin.
