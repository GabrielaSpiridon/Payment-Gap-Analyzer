from django.db.models import Avg
from analysis.models.employee import Employee
from analysis.statistic.salary_by_gender_job_title import get_salary_by_gender_job_title

def get_job_title_salary_alerts(threshold: float = 5.0):
    """
    Returnează o listă de dict-uri, câte unul pentru fiecare job title unde
    diferența mediei pe gen depășește ±threshold% față de media totală.
    Fiecare element conține și lista angajaților cu salariul sub media totală.
    """
    gender_data = get_salary_by_gender_job_title()
    alerts = []

    for job_name, genders in gender_data.items():
        avg_m = genders.get('Male', 0.0)
        avg_f = genders.get('Female', 0.0)

        # Calculăm media totală pentru job_name (toți angajații, indiferent de gen)
        total_agg = Employee.objects\
            .filter(id_job_title__job_title=job_name)\
            .aggregate(avg=Avg('salary'))
        avg_total = float(total_agg['avg'] or 0.0)

        # Procentele de diferență
        diff_m = (abs(avg_m - avg_total) / avg_total * 100) if avg_total else 0.0
        diff_f = (abs(avg_f - avg_total) / avg_total * 100) if avg_total else 0.0

        # Dacă oricare diferență > prag, pregătim alerta
        if diff_m > threshold or diff_f > threshold:
            # Adunăm angajații sub media totală
            below_qs = Employee.objects\
                .filter(id_job_title__job_title=job_name, salary__lt=avg_total)\
                .values('id_employee', 'first_name', 'second_name', 'salary')

            employees_below = [
                {
                    'id': emp['id_employee'],
                    'name': f"{emp['first_name']} {emp['second_name']}",
                    'salary': float(emp['salary']),
                }
                for emp in below_qs
            ]

            alerts.append({
                'job_title': job_name,
                'avg_total': avg_total,
                'avg_m': avg_m,
                'avg_f': avg_f,
                'diff_m': diff_m,
                'diff_f': diff_f,
                'employees_below_avg': employees_below,
            })

    return alerts
