from django.shortcuts import render, redirect
from .forms import registrationForm
from django.contrib.auth import login, logout, authenticate

# Create your views here.
def signUp(request):
    if request.method == "GET":
        form = registrationForm()
    elif request.method == "POST":
        form = registrationForm(request.POST)

        if form.is_valid():
            user = form.save()
            login(request, user)
            print("newUser!")
            return redirect("/home/")

    return render(request, 'registration/signUp.html', {"form": form})