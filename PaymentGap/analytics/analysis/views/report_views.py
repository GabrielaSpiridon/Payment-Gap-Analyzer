from django.http import JsonResponse
from ..report.company_details import get_company_details
from ..report.salary_review import get_job_title_salary_alerts
from ..report.gender_distribution_alerts import get_gender_distribution_alerts

def company_details_api(request):
    data = get_company_details()
    return JsonResponse(data)

def job_title_salary_alerts_api(request):
    alerts = get_job_title_salary_alerts()
    return JsonResponse(alerts, safe=False)

def gender_distribution_alerts_api(request):
    alerts = get_gender_distribution_alerts()
    return JsonResponse(alerts, safe=False)
