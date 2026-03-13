from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

from django.shortcuts import render, redirect
from .forms import AppointmentForm
from .models import Appointment

def book_appointment(request):

    if request.method == "POST":
        form = AppointmentForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('appointment_list')

    else:
        form = AppointmentForm()

    return render(request, "appointments/book.html", {"form": form})


def appointment_list(request):

    appointments = Appointment.objects.filter(status="scheduled").order_by("date","time")

    return render(request, "appointments/appointment_list.html", {
        "appointments": appointments
    })
    
def cancel_appointment(request, id):

    appointment = Appointment.objects.get(id=id)

    appointment.status = "cancelled"
    appointment.save()

    return redirect('appointment_list')
