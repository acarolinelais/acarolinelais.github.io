from fastapi import APIRouter

from app.data.skills import SKILL_GROUPS
from app.schemas import SkillGroup

router = APIRouter(tags=["skills"])


@router.get("/skills", response_model=list[SkillGroup])
def list_skill_groups() -> list[SkillGroup]:
    return SKILL_GROUPS
