from django.shortcuts import render

# Create your views here.
def viewer(request):
    if request.method == 'GET':
        return render(request, 'viewer.html', {})
    elif request.method == 'POST':
        case = request.POST.get('case', '')
        cards = case.split('\r\n\r\n')
        return render(request, 'results.html', {'cards': cards})