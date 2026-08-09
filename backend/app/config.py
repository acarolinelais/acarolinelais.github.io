import os


def get_allowed_origins() -> list[str]:
    """CORS origins allowed to call this API.

    Set ALLOWED_ORIGINS (comma-separated) in the environment for production,
    e.g. ALLOWED_ORIGINS=https://caroline.is-a.dev
    """
    raw = os.environ.get("ALLOWED_ORIGINS")
    if raw:
        return [origin.strip() for origin in raw.split(",") if origin.strip()]
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
