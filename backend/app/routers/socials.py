from fastapi import APIRouter

from app.data.socials import SOCIALS
from app.schemas import SocialLink

router = APIRouter(tags=["socials"])


@router.get("/socials", response_model=list[SocialLink])
def list_socials() -> list[SocialLink]:
    return SOCIALS
