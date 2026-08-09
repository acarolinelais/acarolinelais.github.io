from fastapi import APIRouter, HTTPException

from app.database import save_contact_message
from app.schemas import ContactMessageIn, ContactMessageOut

router = APIRouter(tags=["contact"])


@router.post("/contact", response_model=ContactMessageOut)
def create_contact_message(payload: ContactMessageIn) -> ContactMessageOut:
    try:
        save_contact_message(payload.name, payload.email, payload.message)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(
            status_code=500, detail="Could not save your message."
        ) from exc
    return ContactMessageOut(ok=True)
