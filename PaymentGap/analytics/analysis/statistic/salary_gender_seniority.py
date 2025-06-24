from datetime import date
from django.db.models import Avg
from django.db.models.functions import ExtractYear
from analysis.models.employee import Employee

def get_salary_by_gender_seniority():
    # Bins pentru vechime
    bins = [
        (0, 2, '0-2 years'),
        (2, 5, '2-5 years'),
        (5, 10, '5-10 years'),
        (10, 100, '10+ years'),
    ]

    current_year = date.today().year

    
    employees = Employee.objects.exclude(salary__isnull=True)\
        .exclude(gender__isnull=True)\
        .exclude(employment_date__isnull=True)\
        .annotate(
            seniority=current_year - ExtractYear('employment_date')
        )

    results = []
    for low, high, label in bins:
        group = employees.filter(seniority__gte=low, seniority__lt=high)
        females = group.filter(gender__in=['f', 'female', 'F', 'Female', 'FEMALE']).aggregate(avg_salary=Avg('salary'))['avg_salary']
        males = group.filter(gender__in=['m', 'male', 'M', 'Male', 'MALE']).aggregate(avg_salary=Avg('salary'))['avg_salary']
        total = group.aggregate(avg_salary=Avg('salary'))['avg_salary']
        results.append({
            'seniority': label,
            'Male': float(males) if males is not None else None,
            'Female': float(females) if females is not None else None,
            'Total': float(total) if total is not None else None,
        })
    return results
