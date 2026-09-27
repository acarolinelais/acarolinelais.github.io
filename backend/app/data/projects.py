from app.schemas import Project

# Edit this list to add, update or remove projects shown on the site.
PROJECTS: list[Project] = [
    Project(
        slug="maestro",
        title="Architech",
        subtitle="Tech Blog",
        description=(
            "Architech is a personal blog where I share posts explaining "
            "programming concepts and lessons learned in a simple, practical way. "
            "The front-end was built with React, the back-end with Python, and the "
            "data is stored in a PostgreSQL database. Besides helping people who are "
            "learning, the project is also my space to put what I study into practice."
        ),
        tech=["react", "python", "postgresql"],
        link=None,
        status="in-progress",
    ),
    Project(
        slug="byterise",
        title="Lendora",
        subtitle="Mortgage Dashboard",
        description=(
            "Lendora is a modern dashboard UI for mortgage advisors that "
            "combines rate analytics, client tracking, and performance "
            "insights. Designed to help users streamline loan workflows, "
            "manage leads, and collaborate through a built-in community "
            "space."
        ),
        tech=["react", "python"],
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
