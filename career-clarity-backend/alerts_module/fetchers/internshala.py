from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from alerts_module.models import Opportunity


INTERNSHALA_URL = "https://internshala.com/internships/"


KEYWORD_TAG_MAP = {
    "python": "tech",
    "developer": "tech",
    "web": "tech",
    "design": "design",
    "marketing": "marketing",
    "data": "data",
    "finance": "finance",
    "sales": "sales",
}


def _infer_tags(text):
    lowered = (text or "").lower()
    found = set()
    for keyword, tag in KEYWORD_TAG_MAP.items():
        if keyword in lowered:
            found.add(tag)
    return sorted(found) or ["internship"]


def fetch_internshala(limit=50):
    created_or_updated = 0

    try:
        response = requests.get(INTERNSHALA_URL, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        links = soup.select("a[href]")
        seen = set()

        for anchor in links:
            title = anchor.get_text(" ", strip=True)
            href = anchor.get("href", "")

            if not title or len(title) < 5:
                continue
            if "internship" not in href.lower() and "internship" not in title.lower():
                continue

            full_link = urljoin(INTERNSHALA_URL, href)
            key = (title.lower(), full_link)
            if key in seen:
                continue
            seen.add(key)

            Opportunity.objects.update_or_create(
                title=title,
                link=full_link,
                defaults={
                    "type": "internship",
                    "level": "UG",
                    "description": "Internship opportunity sourced from Internshala.",
                    "source": "Internshala",
                    "tags": _infer_tags(title),
                },
            )
            created_or_updated += 1

            if created_or_updated >= limit:
                break

    except Exception:
        fallback_data = [
            {
                "title": "Python Developer Intern",
                "link": "https://internshala.com/internships/python-developer-internship",
                "tags": ["tech", "python"],
            },
            {
                "title": "Digital Marketing Intern",
                "link": "https://internshala.com/internships/digital-marketing-internship",
                "tags": ["marketing"],
            },
        ]
        for item in fallback_data:
            Opportunity.objects.update_or_create(
                title=item["title"],
                link=item["link"],
                defaults={
                    "type": "internship",
                    "level": "UG",
                    "description": "Internship opportunity fallback entry.",
                    "source": "Internshala",
                    "tags": item["tags"],
                },
            )
            created_or_updated += 1

    return created_or_updated
