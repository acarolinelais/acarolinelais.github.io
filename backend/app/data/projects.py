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
    Project(
        slug="careops",
        title="CareOps",
        subtitle="ERP Platform",
        description="CareOps is built to help medical centers take full control over their administrative and operational processes - from finances and staffing to scheduling and inventory. Instead of juggling multiple tools, teams get a unified system designed specifically for healthcare workflows.",
        tech=["python", "react", "postgresql", "tailwind"],
        link=None,
        status="coming-soon",
    ),
]
