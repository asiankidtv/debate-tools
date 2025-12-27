from django.shortcuts import render
from .forms import registrationForm

# Create your views here.
def signUp(request):
    if request.method == "GET":
        form = registrationForm()
    elif request.method == "POST":
        form = registrationForm(request.POST)

    return render(request, 'registration/signUp.html', {"form": form})