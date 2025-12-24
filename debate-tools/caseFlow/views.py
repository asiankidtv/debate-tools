from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
import json
from .models import flow

# Create your views here.
def flowpage(request):
    if request.method == "GET":
        flows = flow.objects.all()
        flowsJSON = serializers.serialize("json", flows)
        
        return render(request, "caseFlow/flow.html", {"flows":flows, "flowsJSON":flowsJSON})