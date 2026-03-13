import { useState, useMemo } from 'react'
import Modal from '../components/Modal'
import { PageHeader } from '../components/ui'
import { useAppointments } from '../context/AppointmentsContext'
import { CheckCircle, Stethoscope } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]

function DoctorCard({ doctor, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Stethoscope className="h-6 w-6 text-primary" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-dark">{doctor.name}</p>
          <p className="text-sm text-text-muted mt-0.5">{doctor.specialization}</p>
          <p className="text-xs text-text-muted mt-1">{doctor.available}</p>
        </div>
      </div>
    </button>
  )
}

export default function BookAppointment() {
  const {
    addAppointment,
    getBookedSlots,
    DOCTOR_PROFILES,
    DOCTORS,
    TIME_SLOTS,
  } = useAppointments()

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctor: DOCTORS[0],
    date: today,
    time: '',
    reason: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const bookedSlots = useMemo(
    () => getBookedSlots(formData.date, formData.doctor),
    [formData.date, formData.doctor, getBookedSlots]
  )

  const availableSlots = useMemo(
    () => TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot)),
    [bookedSlots, TIME_SLOTS]
  )

  const selectedDoctorProfile = DOCTOR_PROFILES?.find((d) => d.name === formData.doctor)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'date' || field === 'doctor') {
      setFormData((prev) => ({ ...prev, time: '' }))
    }
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.patientName.trim()) newErrors.patientName = 'Required'
    if (!formData.patientPhone.trim()) newErrors.patientPhone = 'Required'
    if (!formData.patientEmail.trim()) newErrors.patientEmail = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Invalid email'
    }
    if (!formData.doctor) newErrors.doctor = 'Required'
    if (!formData.date) newErrors.date = 'Required'
    if (!formData.time) newErrors.time = 'Please select a time slot'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setConfirmModalOpen(true)
  }

  const handleConfirmBooking = () => {
    setLoading(true)
    try {
      addAppointment(formData)
      setSuccess(true)
      setConfirmModalOpen(false)
      setFormData({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        doctor: DOCTORS[0],
        date: today,
        time: '',
        reason: '',
      })
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (t) => {
    if (!t) return ''
    const [h, m] = t.split(':')
    const hour = parseInt(h, 10)
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        title="Book Appointment"
        subtitle="Schedule a new patient appointment with a doctor"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm font-medium">
            <CheckCircle className="h-5 w-5 shrink-0" strokeWidth={2} />
            Appointment booked successfully!
          </div>
        )}

        <div className="card">
          <h3 className="text-base font-semibold text-text-dark mb-4">Select Doctor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOCTOR_PROFILES?.map((doc) => (
              <DoctorCard
                key={doc.name}
                doctor={doc}
                isSelected={formData.doctor === doc.name}
                onClick={() => handleChange('doctor', doc.name)}
              />
            ))}
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="text-base font-semibold text-text-dark">Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Patient Name *</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
                className={`input-field ${errors.patientName ? 'border-danger' : ''}`}
                placeholder="Full name"
              />
              {errors.patientName && (
                <p className="text-danger text-xs mt-1.5">{errors.patientName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => handleChange('patientPhone', e.target.value)}
                className={`input-field ${errors.patientPhone ? 'border-danger' : ''}`}
                placeholder="555-0000"
              />
              {errors.patientPhone && (
                <p className="text-danger text-xs mt-1.5">{errors.patientPhone}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Email *</label>
            <input
              type="email"
              value={formData.patientEmail}
              onChange={(e) => handleChange('patientEmail', e.target.value)}
              className={`input-field ${errors.patientEmail ? 'border-danger' : ''}`}
              placeholder="patient@email.com"
            />
            {errors.patientEmail && (
              <p className="text-danger text-xs mt-1.5">{errors.patientEmail}</p>
            )}
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="text-base font-semibold text-text-dark">Date & Time</h3>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={today}
              className={`input-field max-w-xs ${errors.date ? 'border-danger' : ''}`}
            />
            {errors.date && (
              <p className="text-danger text-xs mt-1.5">{errors.date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Time Slot *</label>
            <p className="text-xs text-text-muted mb-2">Unavailable slots are disabled</p>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = formData.time === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => !isBooked && handleChange('time', slot)}
                    disabled={isBooked}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isBooked
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-slate-100 text-text-dark hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                )
              })}
            </div>
            {errors.time && (
              <p className="text-danger text-xs mt-1.5">{errors.time}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Appointment Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              className="input-field min-h-[100px] resize-none"
              placeholder="Brief description of visit reason..."
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Booking...' : 'Proceed to Confirm'}
        </button>
      </form>

      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Appointment"
      >
        <div className="space-y-5">
          <p className="text-sm text-text-muted">Please confirm the following appointment details:</p>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p><span className="text-text-muted">Patient:</span> <strong>{formData.patientName}</strong></p>
            <p><span className="text-text-muted">Doctor:</span> <strong>{formData.doctor}</strong></p>
            <p><span className="text-text-muted">Date:</span> <strong>{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
            <p><span className="text-text-muted">Time:</span> <strong>{formatTime(formData.time)}</strong></p>
            {formData.reason && <p><span className="text-text-muted">Reason:</span> {formData.reason}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleConfirmBooking} disabled={loading} className="btn-primary flex-1">
              {loading ? 'Booking...' : 'Confirm & Book'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
