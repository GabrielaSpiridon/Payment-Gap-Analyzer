from analysis.models.employee import Employee
from django.db.models import Count


def normalize_gender(gender):
    if not gender:
        return 'Unknown'
    gender = gender.strip().lower()
    if gender in ['male', 'm']:
        return 'Male'
    if gender in ['female', 'f']:
        return 'Female'
    return gender.capitalize() 

def get_gender_distribution():

    data = Employee.objects.values('gender').annotate(count=Count('id_employee'))
    counts = {}
    for entry in data:
        norm = normalize_gender(entry['gender'])
        counts[norm] = counts.get(norm, 0) + entry['count']
  
    return [{'gender': k, 'count': v} for k, v in counts.items()]

