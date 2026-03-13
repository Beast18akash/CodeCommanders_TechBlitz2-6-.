import { useMemo } from 'react'
import { StatCard, PageHeader } from '../components/ui'
import AppointmentTable from '../components/AppointmentTable'
import { useAppointments } from '../context/AppointmentsContext'
import { CalendarDays, Stethoscope, Users, CheckCircle2 } from 'lucide-react'

export default function Dashboard() {
  const { appointments, patients, DOCTORS } = useAppointments()

  const todayStr = new Date().toISOString().split('T')[0]

  const stats = useMemo(() => {
    const today = appointments.filter((a) => a.date === todayStr)
    const totalToday = today.length
    const completed = appointments.filter((a) => a.status === 'completed').length

    return {
      todayAppointments: totalToday,
      activeDoctors: DOCTORS.length,
      totalPatients: patients.length,
      completedConsultations: completed,
    }
  }, [appointments, patients, todayStr, DOCTORS])

  const todayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === todayStr)
        .sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    [appointments, todayStr]
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hospital Operations Overview"
        subtitle="Real-time clinic performance and today's schedule"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={CalendarDays}
          color="primary"
          trend="Scheduled for today"
        />
        <StatCard
          title="Active Doctors"
          value={stats.activeDoctors}
          icon={Stethoscope}
          color="secondary"
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          color="success"
        />
        <StatCard
          title="Completed Consultations"
          value={stats.completedConsultations}
          icon={CheckCircle2}
          color="success"
        />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-text-dark mb-5">Today&apos;s Schedule</h2>
        <AppointmentTable
          appointments={todayAppointments}
          columns={['patient', 'doctor', 'time', 'status']}
          showActions={false}
        />
      </div>
    </div>
  )
}
