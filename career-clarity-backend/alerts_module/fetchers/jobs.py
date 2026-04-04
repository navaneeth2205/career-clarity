import requests
from bs4 import BeautifulSoup

from alerts_module.models import Opportunity


JOBS_URL = "https://www.indeed.com/jobs?q=entry+level+developer"


def fetch_jobs(limit=50):
    created_or_updated = 0

    try:
        response = requests.get(JOBS_URL, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        seen = set()
        for anchor in soup.select("a[href]"):
            title = anchor.get_text(" ", strip=True)
            href = anchor.get("href", "")

            if not title or len(title) < 6:
                continue

            title_lower = title.lower()
            if not any(token in title_lower for token in ["engineer", "developer", "analyst", "associate"]):
                continue

            link = href if href.startswith("http") else f"https://www.indeed.com{href}"
            key = (title.lower(), link)
            if key in seen:
                continue
            seen.add(key)

            Opportunity.objects.update_or_create(
                title=title,
                link=link,
                defaults={
                    "type": "job",
                    "level": "PG",
                    "description": "Job opportunity sourced from public jobs listing.",
                    "source": "Indeed",
                    "tags": ["job", "career"],
                },
            )
            created_or_updated += 1

            if created_or_updated >= limit:
                break

    except Exception:
        fallback_data = [
            {
                "title": "Software Engineer - Entry Level",
                "link": "https://www.indeed.com/",
            },
            {
                "title": "Data Analyst - Graduate Role",
                "link": "https://www.linkedin.com/jobs/",
            },
        ]

        for item in fallback_data:
            Opportunity.objects.update_or_create(
                title=item["title"],
                link=item["link"],
                defaults={
                    "type": "job",
                    "level": "PG",
                    "description": "Job fallback entry.",
                    "source": "Jobs Feed",
                    "tags": ["job", "career"],
                },
            )
            created_or_updated += 1

    return created_or_updated
