from datetime import date
from collections import defaultdict

import numpy as np
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Min, Max, Q

from ..models import SalaryHistory

def normalize_gender(g):
    if not g:
        return 'Unknown'
    g = g.strip().lower()
    if g in ('m', 'male'):
        return 'Male'
    if g in ('f', 'female'):
        return 'Female'
    return 'Unknown'

@api_view(['GET'])
def gender_pay_gap_trends(request):
    """
    Endpoint: /api/gender-pay-gap-trends/
    Returnează un array de ani cu:
      - avg_total_remuneration_gpg (valori pozitive, absolute)
      - median_total_remuneration_gpg (valori pozitive, absolute)
    Calcul ținând cont de intervalul start_date/end_date.
    """
    # 1) Determină primul și ultimul an din SalaryHistory
    agg = SalaryHistory.objects.aggregate(
        min_start=Min('start_date')
      #  max_end=Max('end_date')
    )
    min_start = agg.get('min_start')
    if not min_start:
        return Response([])
    max_end =  date.today()

    start_year = min_start.year
    end_year = max_end.year

    result   = []
    last_avg = None
    last_med = None

    # 2) Parcurge fiecare an și calculează gap-ul
    for year in range(start_year, end_year + 1):
        start_of_year = date(year, 1, 1)
        end_of_year   = date(year, 12, 31)

        qs = SalaryHistory.objects.filter(
            start_date__lte=end_of_year
        ).filter(
            Q(end_date__gte=start_of_year) | Q(end_date__isnull=True)
        ).select_related('id_employee')

        salaries = defaultdict(list)
        for rec in qs:
            gen = normalize_gender(rec.id_employee.gender)
            if rec.salary is not None:
                salaries[gen].append(float(rec.salary))

        m_list = salaries.get('Male', [])
        f_list = salaries.get('Female', [])

        # calculează avg și median absolut
        avg_gap = None
        med_gap = None
        if m_list and f_list:
            m_avg = sum(m_list) / len(m_list)
            f_avg = sum(f_list) / len(f_list)
            m_med = float(np.median(m_list))
            f_med = float(np.median(f_list))

            # folosim valoare absolută a diferenței
            avg_gap = abs(m_avg - f_avg) / m_avg * 100
            med_gap = abs(m_med - f_med) / m_med * 100

        # propagă ultima valoare cunoscută dacă valori lipsă
        if avg_gap is None and last_avg is not None:
            avg_gap = last_avg
        if med_gap is None and last_med is not None:
            med_gap = last_med

        if avg_gap is not None:
            last_avg = avg_gap
        if med_gap is not None:
            last_med = med_gap

        result.append({
            'year': f"{year}-{str(year+1)[2:]}",
            'avg_total_remuneration_gpg': round(avg_gap, 1) if avg_gap is not None else None,
            'median_total_remuneration_gpg': round(med_gap, 1) if med_gap is not None else None,
        })

    return Response(result)
