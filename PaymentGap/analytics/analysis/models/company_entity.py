from django.db import models

class CompanyEntity(models.Model):
    id_company_entity = models.AutoField(primary_key=True)
    company_entity_name = models.CharField(max_length=30, blank=True, null=True)
    id_region = models.ForeignKey('Region', models.DO_NOTHING, db_column='id_region', blank=True, null=True)
    id_country = models.ForeignKey('Country', models.DO_NOTHING, db_column='id_country', blank=True, null=True)
    id_company = models.ForeignKey('Company', models.DO_NOTHING, db_column='id_company', blank=True, null=True)
    id_department = models.IntegerField(blank=True, null=True)
    id_manager = models.IntegerField(blank=True, null=True)
    id_manager_type = models.IntegerField(blank=True, null=True)
    id_structure = models.IntegerField(blank=True, null=True)


    def __str__(self):
        return self.company_entity_name if self.company_entity_name else "No Company Entity Name"
    
    class Meta:
        db_table = 'company_entities'