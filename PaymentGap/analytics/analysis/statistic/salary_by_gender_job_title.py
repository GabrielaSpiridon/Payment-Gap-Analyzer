from django.db.models import Avg
from analysis.models.employee import Employee

def normalize_gender(g):
    if not g:
        return 'Unknown'
    g = g.strip().lower()
    if g in ['f', 'female']:
        return 'Female'
    if g in ['m', 'male']:
        return 'Male'
    return 'Unknown'

def get_salary_by_gender_job_title():
    data = (
        Employee.objects
        .select_related('id_job_title')
        .exclude(salary__isnull=True)
        .exclude(gender__isnull=True)
        .values('id_job_title__job_title', 'gender')
        .annotate(avg_salary=Avg('salary'))
        .order_by('id_job_title__job_title')
    )

    results = {}

    for row in data:
        job_name = row['id_job_title__job_title']
        gender = normalize_gender(row['gender'])
        if job_name not in results:
            results[job_name] = {}
        results[job_name][gender] = float(row['avg_salary'] or 0)

    return results
