from analysis.statistic.gender_distribution_pie import get_gender_distribution

def get_gender_distribution_alerts(threshold: float = 5.0):
    """
    Dacă diferența procentuală între bărbați și femei > threshold,
    întoarce un dict cu genul minoritar și procentajele.
    Altfel, returnează None.
    """
    dist = get_gender_distribution()  
    # dist == [{'gender': 'Male', 'count': 40}, {'gender': 'Female', 'count': 60}, ...]

    total = sum(item['count'] for item in dist)
    if total == 0 or len(dist) < 2:
        return None

    # calculăm % pe fiecare
    pct = {item['gender']: item['count'] / total * 100 for item in dist}
    male = pct.get('Male', 0.0)
    female = pct.get('Female', 0.0)
    diff = abs(male - female)

    if diff > threshold:
        # determin gen minoritar
        minority = 'Female' if female < male else 'Male'
        return {
            'minority': minority,
            'minority_pct': round(min(male, female), 2),
            'majority_pct': round(max(male, female), 2),
            'diff_pct': round(diff, 2),
        }
    return None
