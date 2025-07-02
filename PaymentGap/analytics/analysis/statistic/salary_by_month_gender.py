from analysis.models.salaryHistory import SalaryHistory
from django.db.models import Avg, F
from django.db.models.functions import TruncMonth

def normalize_gender(g):
    if not g:
        return 'Unknown'
    g = g.strip().lower()
    if g in ['m', 'male']:
        return 'Male'
    if g in ['f', 'female']:
        return 'Female'
    return 'Unknown'

def get_salary_by_month_gender():
    data = (
        SalaryHistory.objects
        .select_related('id_employee')
        .annotate(month=TruncMonth('start_date'))
        .values('month', gender=F('id_employee__gender'))
        .annotate(avg_salary=Avg('salary'))
        .order_by('month')
    )

    monthly_data = {}
    for row in data:
        month = row['month'].strftime('%Y-%m') if row['month'] else 'Unknown'
        gender = normalize_gender(row['gender'])
        avg_salary = float(row['avg_salary']) if row['avg_salary'] else 0

        if month not in monthly_data:
            monthly_data[month] = {'Male': 0, 'Female': 0, 'Unknown': 0}

        monthly_data[month][gender] = avg_salary

    result = []
    for month in sorted(monthly_data):
        result.append({
            'month': month,
            'Male': monthly_data[month]['Male'],
            'Female': monthly_data[month]['Female'],
            'Gap': abs(monthly_data[month]['Male'] - monthly_data[month]['Female'])
        })

    return result
