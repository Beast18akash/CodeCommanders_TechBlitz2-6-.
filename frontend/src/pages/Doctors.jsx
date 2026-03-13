import { PageHeader } from '../components/ui'
import { useAppointments } from '../context/AppointmentsContext'
import { Stethoscope } from 'lucide-react'

export default function Doctors() {
  const { DOCTOR_PROFILES } = useAppointments()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Doctors"
        subtitle="Clinic medical staff and specializations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DOCTOR_PROFILES?.map((doctor) => (
          <div
            key={doctor.name}
            className="card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Stethoscope className="h-8 w-8 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-text-dark">{doctor.name}</h3>
              <p className="text-sm text-text-muted mt-1">{doctor.specialization}</p>
              <p className="text-xs text-text-muted mt-2">{doctor.available}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
