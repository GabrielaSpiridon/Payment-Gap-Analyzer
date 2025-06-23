from django.db.models import Avg, F, Q
from analysis.models.employee import Employee
from analysis.models.salaryHistory import SalaryHistory
import datetime

def get_salary_by_year_gender():
    
    min_year = SalaryHistory.objects.filter(start_date__isnull=False).order_by('start_date').first()
    max_year = SalaryHistory.objects.filter(start_date__isnull=False).order_by('-start_date').first()
    if not min_year or not max_year:
        return []  

    min_year = min_year.start_date.year
    max_year = max_year.start_date.year

    years = list(range(min_year, max_year + 1))
    genders = ['Male', 'Female']

    
    GENDER_MAP = {
        'm': 'Male', 'male': 'Male', 'f': 'Female', 'female': 'Female'
    }

    
    results = {year: {'Male': [], 'Female': [], 'Total': []} for year in years}

    history = (
        SalaryHistory.objects
        .select_related('id_employee')
        .exclude(salary__isnull=True)
        .exclude(id_employee__isnull=True)
        .exclude(id_employee__gender__isnull=True)
    )

    for row in history:
        gender_raw = row.id_employee.gender.strip().lower()
        gender = GENDER_MAP.get(gender_raw, gender_raw.capitalize())
        salary = float(row.salary)
        
        start = row.start_date.year if row.start_date else min_year
        end = row.end_date.year if row.end_date else max_year
        
        for year in years:
            if start <= year <= end:
                results[year][gender].append(salary)
                results[year]['Total'].append(salary)

    
    response = []
    for year in years:
        entry = {'year': year}
        for gender in ['Male', 'Female', 'Total']:
            vals = results[year][gender]
            entry[gender] = round(sum(vals) / len(vals), 2) if vals else None
        response.append(entry)

    return response
