from django.http import JsonResponse
from analysis.statistic.gender_distribution_pie import get_gender_distribution

def gender_distribution_api(request):
    data = get_gender_distribution()
    return JsonResponse(data, safe=False)
