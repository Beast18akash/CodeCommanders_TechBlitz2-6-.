import { useState, useMemo } from 'react'
import Modal from '../components/Modal'
import AppointmentCard from '../components/AppointmentCard'
import { PageHeader } from '../components/ui'
import { useAppointments } from '../context/AppointmentsContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DOCTOR_COLORS = {
  'Dr. Sarah Johnson': 'bg-primary',
  'Dr. Michael Chen': 'bg-secondary',
  'Dr. Emily Davis': 'bg-success',
  'Dr. James Wilson': 'bg-warning',
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const { getAppointmentsByDate } = useAppointments()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days = []
    for (let i = 0; i < startPad; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d))
    }
    return days
  }, [year, month])

  const formatDateKey = (d) => {
    if (!d) return ''
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const appointmentsForSelected = useMemo(() => {
    if (!selectedDate) return []
    return getAppointmentsByDate(formatDateKey(selectedDate))
  }, [selectedDate, getAppointmentsByDate])

  const getAppointmentCount = (d) => {
    if (!d) return 0
    return getAppointmentsByDate(formatDateKey(d)).length
  }

  const isToday = (d) => {
    if (!d) return false
    const t = new Date()
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
  }

  const isSelected = (d) => {
    if (!d || !selectedDate) return false
    return formatDateKey(d) === formatDateKey(selectedDate)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clinic Scheduling"
        subtitle="View and manage appointments by date"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-dark">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1))}
                className="p-2.5 rounded-xl hover:bg-slate-100 text-text-muted hover:text-text-dark transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1))}
                className="p-2.5 rounded-xl hover:bg-slate-100 text-text-muted hover:text-text-dark transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-3">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-text-muted py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((d, i) => (
              <button
                key={i}
                onClick={() => d && setSelectedDate(d)}
                disabled={!d}
                className={`
                  aspect-square p-1 rounded-xl text-sm font-medium transition-all
                  ${!d ? 'invisible' : ''}
                  ${isSelected(d) ? 'bg-primary text-white shadow-md' : ''}
                  ${!isSelected(d) && isToday(d) ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${!isSelected(d) && !isToday(d) ? 'hover:bg-slate-100' : ''}
                `}
              >
                {d?.getDate()}
                {getAppointmentCount(d) > 0 && (
                  <span className={`block text-[10px] mt-0.5 font-normal flex items-center justify-center gap-1 ${isSelected(d) ? 'text-white/90' : 'text-primary'}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSelected(d) ? 'bg-white/80' : 'bg-primary'}`} />
                    {getAppointmentCount(d)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-text-dark mb-4">
            {selectedDate
              ? selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Select a date'}
          </h2>
          {selectedDate ? (
            appointmentsForSelected.length > 0 ? (
              <div className="space-y-3">
                {appointmentsForSelected.map((apt) => (
                  <div key={apt.id} className="relative">
                    <span className={`absolute left-0 top-4 w-1 h-8 rounded-full ${DOCTOR_COLORS[apt.doctor] || 'bg-slate-300'}`} />
                    <div className="pl-4">
                      <AppointmentCard
                        appointment={apt}
                        onClick={() => setSelectedAppointment(apt)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm py-12 text-center">
                No appointments for this date
              </p>
            )
          ) : (
            <p className="text-text-muted text-sm py-12 text-center">
              Click a date to view appointments
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-5">
            <div>
              <p className="text-sm text-text-muted">Patient</p>
              <p className="font-semibold text-text-dark mt-1">{selectedAppointment.patientName}</p>
              {selectedAppointment.patientEmail && (
                <p className="text-sm text-text-muted mt-0.5">{selectedAppointment.patientEmail}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Doctor</p>
              <p className="font-semibold text-text-dark mt-1">{selectedAppointment.doctor}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Date & Time</p>
              <p className="font-semibold text-text-dark mt-1">
                {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {selectedAppointment.time
                  ? `${parseInt(selectedAppointment.time.split(':')[0], 10) % 12 || 12}:${selectedAppointment.time.split(':')[1]} ${parseInt(selectedAppointment.time.split(':')[0], 10) >= 12 ? 'PM' : 'AM'}`
                  : '—'}
              </p>
            </div>
            {selectedAppointment.reason && (
              <div>
                <p className="text-sm text-text-muted">Reason</p>
                <p className="font-medium text-text-dark mt-1">{selectedAppointment.reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
