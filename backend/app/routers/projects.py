from fastapi import APIRouter

from app.data.projects import PROJECTS
from app.schemas import Project

router = APIRouter(tags=["projects"])


@router.get("/projects", response_model=list[Project])
def list_projects() -> list[Project]:
    return PROJECTS
