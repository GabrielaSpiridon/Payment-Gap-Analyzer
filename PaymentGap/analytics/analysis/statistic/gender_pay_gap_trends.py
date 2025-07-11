# your_app/views.py
from collections import defaultdict
import numpy as np
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg, F
from django.db.models.functions import TruncYear
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
    qs = (
        SalaryHistory.objects
        .select_related('id_employee')
        .annotate(year=TruncYear('start_date'))
        .values('year', gender=F('id_employee__gender'))
        .annotate(avg_salary=Avg('salary'))
        .order_by('year')
    )

    temp = defaultdict(lambda: {'Male': 0.0, 'Female': 0.0})
    for row in qs:
        y = row['year'].year
        g = normalize_gender(row['gender'])
        temp[y][g] = float(row['avg_salary'] or 0.0)

    result = []
    for year in sorted(temp):
        m_avg = temp[year]['Male']
        f_avg = temp[year]['Female']
        m_list = list(
            SalaryHistory.objects
            .filter(start_date__year=year,
                    id_employee__gender__iexact='Male')
            .values_list('salary', flat=True)
        )
        f_list = list(
            SalaryHistory.objects
            .filter(start_date__year=year,
                    id_employee__gender__iexact='Female')
            .values_list('salary', flat=True)
        )
        m_med = float(np.median(m_list)) if m_list else 0.0
        f_med = float(np.median(f_list)) if f_list else 0.0

        result.append({
            'year': f"{year}-{str(year+1)[2:]}",        # ← corect!
            'avg_total_remuneration_gpg': (
                (m_avg - f_avg) / m_avg * 100
                if m_avg else 0
            ),
            'avg_base_salary_gpg': 0,
            'median_total_remuneration_gpg': (
                (m_med - f_med) / m_med * 100
                if m_med else 0
            ),
            'median_base_salary_gpg': 0,
        })

    return Response(result)
