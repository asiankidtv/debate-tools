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

        if id == -1:
            newFlow = flow(
                name=JSONdata["name"],
                affCase=JSONdata["affCase"],
                affRebuttal=JSONdata["affRebuttal"],
                affSummary=JSONdata["affSummary"],
                affFinalFocus=JSONdata["affFinalFocus"],
                negCase=JSONdata["negCase"],
                negRebuttal=JSONdata["negRebuttal"],
                negSummary=JSONdata["negSummary"],
                negFinalFocus=JSONdata["negFinalFocus"],)
            newFlow.save()
        else:
            editedFlow = flow.objects.get(id=id)
            editedFlow.name = JSONdata["name"]
            editedFlow.affCase = JSONdata["affCase"]
            editedFlow.affRebuttal = JSONdata["affRebuttal"]
            editedFlow.affSummary = JSONdata["affSummary"]
            editedFlow.affFinalFocus = JSONdata["affFinalFocus"]
            editedFlow.negCase = JSONdata["negCase"]
            editedFlow.negRebuttal = JSONdata["negRebuttal"]
            editedFlow.negSummary = JSONdata["negSummary"]
            editedFlow.negFinalFocus = JSONdata["negFinalFocus"]
            editedFlow.save()


        return HttpResponse("200")