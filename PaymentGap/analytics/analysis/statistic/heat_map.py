from django.http import JsonResponse
from django.views.decorators.http import require_GET
import pandas as pd

from .salary_gender_department import get_salary_by_gender_department


@require_GET
def heatmap_data_api(request):
    # 1. Obții datele
    data = get_salary_by_gender_department()
    df = pd.DataFrame.from_dict(data, orient="index").fillna(0)

    # 2. Calculezi gap-ul
    df["Gap"] = (df["Male"] - df["Female"]).abs()

    # 3. Pregătești structura JSON
    rows = ["Male", "Female", "Gap"]
    cols = df.index.tolist()
    values = [
        df["Male"].tolist(),
        df["Female"].tolist(),
        df["Gap"].tolist(),
    ]

    return JsonResponse({"rows": rows, "cols": cols, "values": values}, safe=False)