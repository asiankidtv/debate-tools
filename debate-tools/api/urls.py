from django.urls import path
from .views import saveFlow, deleteFlow, summarize

urlpatterns = [
    path('saveFlow/', saveFlow),
    path('deleteFlow/', deleteFlow),
    path('summarizeFlow/', summarize),
]