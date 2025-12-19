from django.db import models

# Create your models here.
class flow(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    affCase = models.JSONField(blank=True, null=True)
    affRebuttal = models.JSONField(blank=True, null=True)
    affSummary = models.JSONField(blank=True, null=True)
    affFinalFocus = models.JSONField(blank=True, null=True)

    negCase = models.JSONField(blank=True, null=True)
    negRebuttal = models.JSONField(blank=True, null=True)
    negSummary = models.JSONField(blank=True, null=True)
    negFinalFocus = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.name