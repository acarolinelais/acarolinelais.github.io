from app.schemas import Project

# Edit this list to add, update or remove projects shown on the site.
PROJECTS: list[Project] = [
    Project(
        slug="maestro",
        title="Data Wave",
        subtitle="Job Search App",
        description=(
            "Designed to make job searching faster and more enjoyable with a "
            "clean interface, smooth navigation, and a modern visual style. "
            "This concept focuses on helping users discover opportunities, "
            "explore job listings, and connect with employers through a "
            "simple and intuitive mobile experience."
        ),
        tech=["react", "python"],
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
