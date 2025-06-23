from django.http import JsonResponse
from analysis.statistic.gender_distribution_pie import get_gender_distribution
from analysis.statistic.salary_gender_department import get_salary_by_gender_department

def gender_distribution_api(request):
    data = get_gender_distribution()
    return JsonResponse(data, safe=False)

def salary_gender_department_api(request):
    data = get_salary_by_gender_department()
    return JsonResponse(data)