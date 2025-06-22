from django.db import models

class Location(models.Model):
    id_location = models.AutoField(primary_key=True)
    id_country = models.ForeignKey('Country', models.DO_NOTHING, db_column='id_country', blank=True, null=True)
    city_name = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return self.city_name if self.city_name else "No location Name"
    
    class Meta:
        db_table = 'locations'
