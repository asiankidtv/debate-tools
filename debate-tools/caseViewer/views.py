from django.shortcuts import render

# Create your views here.
def viewer(request):
    if request.method == 'GET':
        return render(request, 'viewer.html', {})
    elif request.method == 'POST':
        print(request.POST.get('case'))
        return render(request, 'viewer.html', {})