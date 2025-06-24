from django.http import JsonResponse
from analysis.statistic.gender_distribution_pie import get_gender_distribution
from analysis.statistic.salary_gender_department import get_salary_by_gender_department
from analysis.statistic.salary_by_year import get_salary_by_year_gender
from analysis.statistic.salary_gender_seniority import get_salary_by_gender_seniority



def gender_distribution_api(request):
    data = get_gender_distribution()
    return JsonResponse(data, safe=False)

def salary_gender_department_api(request):
    data = get_salary_by_gender_department()
    return JsonResponse(data)

def salary_by_year_api(request):
    data = get_salary_by_year_gender()
    return JsonResponse(data, safe=False)

def salary_gender_seniority_api(request):
    data = get_salary_by_gender_seniority()
    return JsonResponse(data, safe=False)