from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
import json
from .models import flow

# Create your views here.
@login_required(login_url="/accounts/login/")
def flowpage(request):
    if request.method == "GET":
        flows = flow.objects.filter(user=request.user)
        flowsJSON = serializers.serialize("json", flows)
        
        return render(request, "caseFlow/flow.html", {"flows":flows, "flowsJSON":flowsJSON})