from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def receptionist_dashboard(request):
    if request.user.role != "receptionist":
        return HttpResponse("Unauthorized")
    
def doctor_dashboard(request):
    if request.user.role != "doctor":
        return HttpResponse("Unauthorized")