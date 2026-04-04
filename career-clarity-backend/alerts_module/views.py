from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import Profile
from cv_module.models import CVProfile
from test_module.models import TestResult

from alerts_module.models import Opportunity, UserAlertCache
from alerts_module.run_fetchers import run_all_fetchers
from alerts_module.utils import _to_tokens, rank_alerts


def _normalize_level(level):
    raw = (level or "").strip().upper()

    if raw in {"10", "CLASS 10", "10TH"}:
        return "10"
    if raw in {"12", "CLASS 12", "12TH", "INTERMEDIATE"}:
        return "12"
    if raw in {"UG", "UNDERGRAD", "UNDERGRADUATE", "BACHELOR"}:
        return "UG"
    if raw in {"PG", "POSTGRAD", "POSTGRADUATE", "MASTER"}:
        return "PG"

    return "12"


def _format_eligibility(level):
    label_map = {
        "10": "Class 10 students",
        "12": "Class 12 students",
        "UG": "Undergraduate students",
        "PG": "Postgraduate students",
    }
    return label_map.get(level, "Students matching the listed level")


def _eligible_levels_for_user(level):
    level = (level or "").upper()
    level_map = {
        "10": ["10", "12"],
        "12": ["12"],
        "UG": ["UG", "PG"],
        "PG": ["PG"],
    }
    return level_map.get(level, ["12"])


def _is_opportunity_eligible_for_user(opportunity, user_level):
    user_level = (user_level or "").upper()
    opportunity_level = (getattr(opportunity, "level", "") or "").upper()
    opportunity_type = (getattr(opportunity, "type", "") or "").lower()

    if user_level == "10":
        return opportunity_level in {"10", "12"} or opportunity_type in {"scholarship", "exam"}

    if user_level == "12":
        return opportunity_level == "12" or opportunity_type in {"scholarship", "exam"}

    if user_level == "UG":
        return opportunity_level in {"UG", "PG"} or opportunity_type in {"scholarship", "exam", "internship", "job"}

    if user_level == "PG":
        return opportunity_level == "PG" or opportunity_type in {"scholarship", "exam", "job", "internship"}

    return True


def _normalize_interest_payload(payload):
    if not payload:
        return []
    if isinstance(payload, dict):
        values = []
        for value in payload.values():
            if isinstance(value, (list, tuple, set)):
                values.extend(list(value))
            else:
                values.append(value)
        return values
    if isinstance(payload, (list, tuple, set)):
        return list(payload)
    return [payload]


def _build_signature(values):
    tokens = sorted(_to_tokens(values))
    return "|".join(tokens)


def _alert_haystack(opportunity):
    tags = opportunity.tags if isinstance(opportunity.tags, list) else []
    return " ".join(
        [
            opportunity.title or "",
            opportunity.description or "",
            opportunity.source or "",
            " ".join(tags),
        ]
    ).lower()


def _filter_by_interest(alerts, interests, skills):
    interest_tokens = _to_tokens(interests)
    skill_tokens = _to_tokens(skills)

    if not interest_tokens and not skill_tokens:
        return alerts

    matched = []
    for opportunity in alerts:
        haystack = _alert_haystack(opportunity)
        if any(token in haystack for token in interest_tokens) or any(token in haystack for token in skill_tokens):
            matched.append(opportunity)

    return matched or alerts


def _serialize_opportunity(opportunity):
    return {
        "id": opportunity.id,
        "title": opportunity.title,
        "type": opportunity.type,
        "level": opportunity.level,
        "eligibility": _format_eligibility(opportunity.level),
        "description": opportunity.description,
        "link": opportunity.link,
        "deadline": opportunity.deadline.isoformat() if opportunity.deadline else None,
        "deadline_display": opportunity.deadline.isoformat() if opportunity.deadline else "To be announced",
        "source": opportunity.source,
        "tags": opportunity.tags or [],
        "created_at": opportunity.created_at.isoformat() if opportunity.created_at else None,
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_alerts(request):
    user = request.user

    try:
        run_all_fetchers()
    except Exception:
        pass

    profile = Profile.objects.filter(user=user).first()
    raw_level = ""
    if profile:
        raw_level = getattr(profile, "class_level", "") or getattr(profile, "education_level", "")
    level = _normalize_level(raw_level)

    latest_test = TestResult.objects.filter(user=user).order_by("-created_at").first()
    profile_interests = _normalize_interest_payload(getattr(profile, "interests", []) if profile else [])
    test_interests = _normalize_interest_payload(latest_test.interest_data if latest_test else {})
    interest = profile_interests + test_interests

    cv_profile = CVProfile.objects.filter(user=user).first()
    skills = cv_profile.skills if cv_profile else []

    eligible_levels = _eligible_levels_for_user(level)
    alerts_queryset = Opportunity.objects.filter(level__in=eligible_levels).order_by("-created_at")
    alerts = [item for item in alerts_queryset if _is_opportunity_eligible_for_user(item, level)]

    if not alerts:
        alerts = list(Opportunity.objects.all().order_by("-created_at"))

    filtered_alerts = _filter_by_interest(alerts, interest, skills)
    ranked_alerts = rank_alerts(filtered_alerts, interest, skills)

    recommended = ranked_alerts[:50]
    all_alerts = ranked_alerts

    UserAlertCache.objects.update_or_create(
        user=user,
        defaults={
            "user_level": level,
            "interest_signature": _build_signature(interest),
            "skill_signature": _build_signature(skills),
            "alerts": [_serialize_opportunity(item) for item in all_alerts],
            "total_available": len(all_alerts),
        },
    )

    return Response(
        {
            "recommended": [_serialize_opportunity(item) for item in recommended],
            "alerts": [_serialize_opportunity(item) for item in all_alerts],
            "total_count": len(all_alerts),
            "user_level": level,
        }
    )
