"""
URL configuration for debateTools project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts import views as accounts_views
from homepage import views as homepage_views
from caseViewer import views as caseviewer_views
from caseFlow import views as caseFlow_views

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('', homepage_views.homepage),
    path('home/', homepage_views.homepage),
    path('viewer/', caseviewer_views.viewer),
    path('flow/', caseFlow_views.flowpage),
    path('evidence/', include("evidence.urls")),
    path('api/', include("api.urls")),
    path('accounts/', include("django.contrib.auth.urls")),
    path('signUp/', accounts_views.signUp),
]