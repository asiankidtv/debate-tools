from django.urls import path
from .views import saveFlow, deleteFlow, summarize, search_evidence

urlpatterns = [
    path('saveFlow/', saveFlow),
    path('deleteFlow/', deleteFlow),
    path('summarizeFlow/', summarize),
    path('searchEvidence/', search_evidence),
]