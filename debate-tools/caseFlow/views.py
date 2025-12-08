from django.shortcuts import render

# Create your views here.
def flowpage(request):
    return render(request, "caseFlow/flow.html")