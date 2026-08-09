from typing import Literal

from pydantic import BaseModel, EmailStr, Field

TechIcon = Literal[
    "python", "react", "tailwind", "cryptoWallet", "codeMerge", "cubeAlt"
]

IconName = Literal[
    "arrowUpRight",
    "backpack",
    "codeMerge",
    "cryptoWallet",
    "cubeAlt",
    "github",
    "home",
    "instagram",
    "linkedin",
    "mail",
    "python",
    "react",
    "starRing",
    "tailwind",
]


class Project(BaseModel):
    slug: str
    title: str
    subtitle: str
    description: str
    tech: list[TechIcon]
    link: str | None = None
    status: Literal["live", "in-progress", "coming-soon"]


class SkillGroup(BaseModel):
    id: str
    title: str
    description: str
    icons: list[IconName]


class SocialLink(BaseModel):
    id: str
    label: str
    href: str
    icon: Literal["linkedin", "instagram", "github", "mail"]


class ContactMessageIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)


class ContactMessageOut(BaseModel):
    ok: bool
