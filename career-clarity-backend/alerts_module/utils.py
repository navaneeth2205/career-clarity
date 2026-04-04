def _to_tokens(values):
    if not values:
        return set()

    if isinstance(values, dict):
        values = list(values.keys()) + list(values.values())

    if isinstance(values, str):
        values = [values]

    tokens = set()
    for value in values:
        if not isinstance(value, str):
            continue
        for token in value.lower().replace("/", " ").replace("-", " ").split():
            clean = token.strip()
            if clean:
                tokens.add(clean)
    return tokens


def rank_alerts(alerts, interest, skills):
    interest_tokens = _to_tokens(interest)
    skill_tokens = _to_tokens(skills)

    scored = []
    for alert in alerts:
        haystack = " ".join(
            [
                getattr(alert, "title", ""),
                getattr(alert, "description", ""),
                " ".join(getattr(alert, "tags", []) if isinstance(getattr(alert, "tags", []), list) else []),
            ]
        ).lower()

        score = 1
        if any(token in haystack for token in interest_tokens):
            score += 5
        if any(token in haystack for token in skill_tokens):
            score += 3

        scored.append((score, alert))

    scored.sort(key=lambda item: (item[0], getattr(item[1], "created_at", None)), reverse=True)
    return [item[1] for item in scored]
