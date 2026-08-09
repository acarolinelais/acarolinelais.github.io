from app.schemas import SkillGroup

# Edit this list to add, update or remove skill groups shown on /skills.
SKILL_GROUPS: list[SkillGroup] = [
    SkillGroup(
        id="frontend",
        title="Frontend",
        description=(
            "Interfaces, design systems and interactions built with "
            "React and Tailwind CSS."
        ),
        icons=["react", "tailwind"],
    ),
    SkillGroup(
        id="backend",
        title="Backend & Automation",
        description="APIs, automation scripts and tests written in Python.",
        icons=["python", "codeMerge"],
    ),
]
