from django.urls import path
from .views import saveFlow, deleteFlow

urlpatterns = [
    path('saveFlow/', saveFlow),
    path('deleteFlow/', deleteFlow),
]