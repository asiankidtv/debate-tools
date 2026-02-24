from django.shortcuts import render
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from caseFlow.models import flow
from google import genai
import json

# Create your views here.
def saveFlow(request):
    if request.method == "GET":
        return HttpResponseForbidden("You are not supposed to be here.")
    elif request.method == "POST":
        data = request.body.decode('utf-8')
        JSONdata = json.loads(data)
        id = JSONdata["id"]

        if id == -1:
            newFlow = flow(
                name=JSONdata["name"],
                user=request.user,
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
            editedFlow.user=request.user
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
    

def deleteFlow(request):
    if request.method == "GET":
        return HttpResponseForbidden("Turn Away.")
    elif request.method == "POST":
        data = request.body.decode('utf-8')
        JSONdata = json.loads(data)
        id = JSONdata["id"]

        flow.objects.get(id=id).delete()
        return HttpResponse("200")
    
def summarize(request):
    if request.method == "GET":
        return HttpResponseForbidden("Nuh uh uh...")
    elif request.method == "POST":
        client = genai.Client()
        data = request.body.decode('utf-8')
        JSONdata = json.loads(data)
        for k, v in JSONdata.items():
            if v == "\n":
                JSONdata[k] = "There is nothing for the " + k
        
        prompt = "" \
        "Given the following Public Forum Debate Flow, summarize the round so far and analyze any holes or strengths of either side of the round. Keep the response under 200 Words No matter what." \
        f"The flow for the Aff Case is: {JSONdata["affCase"]}" \
        f"The flow for the Neg Rebuttal is: {JSONdata["negRebuttal"]}" \
        f"The flow for the Aff Summary is: {JSONdata["affSummary"]}" \
        f"The flow for the Neg Final Focus is: {JSONdata["negFinalFocus"]}" \
        f"The flow for the Neg Case is: {JSONdata["negCase"]}" \
        f"The flow for the Aff Rebuttal is: {JSONdata["affRebuttal"]}" \
        f"The flow for the Neg Summary is: {JSONdata["negSummary"]}" \
        f"The flow for the Aff Final Focus is: {JSONdata["affFinalFocus"]}"

        response = client.models.generate_content(
            model='gemini-2.5-flash-lite',
            contents=prompt
        )

        return JsonResponse({
            "response": response.text
        })