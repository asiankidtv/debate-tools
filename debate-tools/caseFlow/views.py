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
    elif request.method == "POST":
        print("------------------------------------------------------------------")
        data = request.body.decode('utf-8')
        JSONdata = json.loads(data)
        id = JSONdata["id"]
        print(JSONdata)

        """if id == -1:
            newFlow = flow()
        else:
            editedFlow = flow.objects.filter(id=id)
            print(editedFlow)"""




        return HttpResponse("200")