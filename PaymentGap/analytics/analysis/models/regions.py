from django.db import models

class Region(models.Model):
    id_region = models.AutoField(primary_key=True)
    region_name = models.CharField(unique=True, max_length=25, blank=True, null=True)

    def __str__(self):
        return self.region_name if self.region_name else "No Region Name"
    
    class Meta:
        db_table = 'regions'

