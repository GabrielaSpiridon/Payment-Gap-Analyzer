from django.http import JsonResponse
from ..report.company_details import get_company_details

def company_details_api(request):
    data = get_company_details()
    return JsonResponse(data)
