from django.db.models import Avg
from analysis.models.employee import Employee
from analysis.models.company_entity import CompanyEntity
from analysis.models.departments import Department

def get_salary_by_gender_department():
    data = (
        Employee.objects
        .values('id_department', 'gender')
        .exclude(salary__isnull=True)
        .exclude(gender__isnull=True)
        .annotate(avg_salary=Avg('salary'))
        .order_by('id_department', 'gender')
    )

    GENDER_MAP = {
        'm': 'Male', 'male': 'Male', 'f': 'Female', 'female': 'Female'
    }

    results = {}
    for row in data:
        company_entity = CompanyEntity.objects.filter(id_company_entity=row['id_department']).first()
        if company_entity and company_entity.id_department:
            department = Department.objects.filter(id_department=company_entity.id_department).first()
            dept_name = department.department_name if department else "No Department"
        else:
            dept_name = "No Department"

        gender = row['gender'].strip().lower() if row['gender'] else "Other"
        gender_std = GENDER_MAP.get(gender, gender.capitalize())
        if dept_name not in results:
            results[dept_name] = {}
        results[dept_name][gender_std] = float(row['avg_salary'] or 0)

    return results
