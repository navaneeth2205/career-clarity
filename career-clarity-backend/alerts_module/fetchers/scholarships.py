from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from alerts_module.models import Opportunity


SCHOLARSHIP_URL = "https://scholarships.gov.in/"


def _detect_level(text):
    lowered = (text or "").lower()
    if "10" in lowered or "ssc" in lowered or "secondary" in lowered:
        return "10"
    if "12" in lowered or "intermediate" in lowered or "hsc" in lowered:
        return "12"
    return "12"


def fetch_scholarships(limit=50):
    created_or_updated = 0

    try:
        response = requests.get(SCHOLARSHIP_URL, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        seen = set()
        for anchor in soup.select("a[href]"):
            title = anchor.get_text(" ", strip=True)
            href = anchor.get("href", "")

            if not title or len(title) < 5:
                continue

            title_lower = title.lower()
            if not any(k in title_lower for k in ["scholar", "scheme", "student"]):
                continue

            full_link = urljoin(SCHOLARSHIP_URL, href)
            key = (title.lower(), full_link)
            if key in seen:
                continue
            seen.add(key)

            level = _detect_level(title)
            Opportunity.objects.update_or_create(
                title=title,
                link=full_link,
                defaults={
                    "type": "scholarship",
                    "level": level,
                    "description": "Scholarship opportunity sourced from NSP.",
                    "source": "National Scholarship Portal",
                    "tags": ["scholarship", f"class-{level}"],
                },
            )
            created_or_updated += 1

            if created_or_updated >= limit:
                break

    except Exception:
        fallback_data = [
            {
                "title": "Pre-Matric Scholarship Scheme",
                "link": "https://scholarships.gov.in/",
                "level": "10",
            },
            {
                "title": "Post-Matric Scholarship Scheme",
                "link": "https://scholarships.gov.in/",
                "level": "12",
            },
        ]

        for item in fallback_data:
            Opportunity.objects.update_or_create(
                title=item["title"],
                link=item["link"],
                defaults={
                    "type": "scholarship",
                    "level": item["level"],
                    "description": "Scholarship fallback entry.",
                    "source": "National Scholarship Portal",
                    "tags": ["scholarship", f"class-{item['level']}"],
                },
            )
            created_or_updated += 1

    return created_or_updated
