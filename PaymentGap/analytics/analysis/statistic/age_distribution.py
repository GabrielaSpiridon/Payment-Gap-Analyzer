from analysis.models.employee import Employee
from datetime import date
from django.db.models import Count

def calculate_age(birth_date):
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

def get_age_distribution():
    data = Employee.objects.values('date_of_birth')
    bins = {'<25': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0}

    for entry in data:
        dob = entry['date_of_birth']
    
        age = calculate_age(dob)
        if age < 25:
            bins['<25'] += 1
        elif age < 35:
            bins['25-34'] += 1
        elif age < 45:
            bins['35-44'] += 1
        elif age < 55:
            bins['45-54'] += 1
        else:
            bins['55+'] += 1

    return [{'age_group': k, 'count': v} for k, v in bins.items()]
