from ..models.company_entity import CompanyEntity

def get_company_details():
    # 'select_related' gives us the related objects in a single query
    ce = CompanyEntity.objects.select_related('id_company','id_region', 'id_country').first()

    return {
        "company_name": ce.id_company.company_name,
        "region":       ce.id_region.region_name,  
        "country":      ce.id_country.country_name, 

    }
