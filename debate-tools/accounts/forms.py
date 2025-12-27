from django import forms

# Form Template
from django.contrib.auth.forms import UserCreationForm

# Model to store users
from django.contrib.auth.models import User

class registrationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']