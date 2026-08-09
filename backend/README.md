# backend

FastAPI service exposing projects, skills, socials and a contact form
endpoint (stored in a local SQLite file, `data.db`, created on first run).

See the [repo root README](../README.md) for setup, content editing and
deployment notes.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs
