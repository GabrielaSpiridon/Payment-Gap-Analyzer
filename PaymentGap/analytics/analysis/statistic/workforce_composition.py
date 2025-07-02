from analysis.models.employee import Employee
from django.db.models import Count, Q

def normalize_gender(g):
    if not g:
        return 'Unknown'
    g = g.strip().lower()
    if g in ['f', 'female']:
        return 'Female'
    if g in ['m', 'male']:
        return 'Male'
    return 'Unknown'

def get_workforce_composition():
    manager_ids = Employee.objects.exclude(id_line_manager__isnull=True)\
        .values_list('id_line_manager', flat=True).distinct()

    roles = {
        'All employees': Q(),
        'Manager': Q(id_employee__in=manager_ids),
        'Non-manager': ~Q(id_employee__in=manager_ids)
    }

    results = []

    for label, filter_cond in roles.items():
        queryset = Employee.objects.filter(filter_cond)
        total = queryset.count()

        gender_counts = (
            queryset.values('gender')
            .annotate(count=Count('id_employee'))
        )

        female = male = 0
        for row in gender_counts:
            g = normalize_gender(row['gender'])
            if g == 'Female':
                female += row['count']
            elif g == 'Male':
                male += row['count']

        female_percent = round((female / total) * 100, 1) if total > 0 else 0
        male_percent = round((male / total) * 100, 1) if total > 0 else 0

        results.append({
            'category': label,
            'Female': female_percent,
            'Male': male_percent,
            'Female_count': female,
            'Male_count': male
        })

    return results
