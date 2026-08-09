from app.schemas import Project

# Edit this list to add, update or remove projects shown on the site.
PROJECTS: list[Project] = [
    Project(
        slug="maestro",
        title="Maestro",
        subtitle="Developer Tool",
        description=(
            "A developer tool built with Python and React. "
            "More details coming soon."
        ),
        tech=["python", "react"],
        link=None,
        status="in-progress",
    ),
    Project(
        slug="byterise",
        title="ByteRise",
        subtitle="Crypto Extend",
        description=(
            "A crypto-focused extension built with Python and React. "
            "More details coming soon."
        ),
        tech=["python", "react"],
        link=None,
        status="in-progress",
    ),
    Project(
        slug="coming-soon",
        title="Maestro",
        subtitle="Developer Tool",
        description="Another project slot, reserved for what comes next.",
        tech=["python", "react"],
        link=None,
        status="coming-soon",
    ),
]
