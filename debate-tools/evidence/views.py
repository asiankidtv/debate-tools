from django.shortcuts import render

def search_page(request):
    return render(request, "evidence/search.html")
