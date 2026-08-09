from app.schemas import SocialLink

# Edit this list to update the social links shown on the home page.
SOCIALS: list[SocialLink] = [
    SocialLink(id="linkedin", label="LinkedIn", href="https://linkedin.com", icon="linkedin"),
    SocialLink(id="instagram", label="Instagram", href="https://instagram.com", icon="instagram"),
    SocialLink(id="github", label="GitHub", href="https://github.com", icon="github"),
    SocialLink(id="mail", label="Email", href="mailto:hello@example.com", icon="mail"),
]
