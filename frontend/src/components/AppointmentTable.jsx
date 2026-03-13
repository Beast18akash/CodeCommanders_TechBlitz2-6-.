import StatusBadge from './StatusBadge'
import { EmptyState } from './ui'
import { ClipboardList, Eye, CalendarClock, XCircle } from 'lucide-react'

function Avatar({ name, className = 'h-9 w-9' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
  return (
    <div className={`${className} shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm`}>
      {initials}
    </div>
  )
}

export default function AppointmentTable({
  appointments,
  onView,
  onEdit,
  onReschedule,
  onCancel,
  onComplete,
  showActions = true,
  columns = ['patient', 'doctor', 'date', 'time', 'status', 'actions'],
}) {
  if (!appointments?.length) {
    return (
      <div className="py-12">
        <EmptyState
          icon={ClipboardList}
          title="No appointments scheduled today"
          description="Appointments will appear here when they are booked. Schedule a new appointment to get started."
        />
      </div>
    )
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (time) => {
    if (!time) return '—'
    const [h, m] = time.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  }

  const ActionButton = ({ onClick, children, icon: Icon, variant = 'primary' }) => {
    const variants = {
      primary: 'hover:bg-primary/10 text-primary',
      secondary: 'hover:bg-secondary/10 text-secondary',
      success: 'hover:bg-success/10 text-success',
      danger: 'hover:bg-danger/10 text-danger',
    }
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${variants[variant] || variants.primary}`}
      >
        {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
        {children}
      </button>
    )
  }

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.includes('patient') && (
              <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Patient
              </th>
            )}
            {columns.includes('doctor') && (
              <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Doctor
              </th>
            )}
            {columns.includes('date') && (
              <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Date
              </th>
            )}
            {columns.includes('time') && (
              <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Time
              </th>
            )}
            {columns.includes('status') && (
              <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Status
              </th>
            )}
            {showActions && columns.includes('actions') && (
              <th className="text-right py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr
              key={apt.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
            >
              {columns.includes('patient') && (
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={apt.patientName} />
                    <div>
                      <p className="font-medium text-text-dark">{apt.patientName}</p>
                      {apt.patientEmail && (
                        <p className="text-sm text-text-muted mt-0.5">{apt.patientEmail}</p>
                      )}
                    </div>
                  </div>
                </td>
              )}
              {columns.includes('doctor') && (
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={apt.doctor} className="h-8 w-8" />
                    <span className="text-text-dark">{apt.doctor}</span>
                  </div>
                </td>
              )}
              {columns.includes('date') && (
                <td className="py-4 px-4 text-text-dark">{formatDate(apt.date)}</td>
              )}
              {columns.includes('time') && (
                <td className="py-4 px-4 text-text-dark">{formatTime(apt.time)}</td>
              )}
              {columns.includes('status') && (
                <td className="py-4 px-4">
                  <StatusBadge status={apt.status} />
                </td>
              )}
              {showActions && columns.includes('actions') && (
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    {apt.status === 'booked' && (
                      <>
                        {onView && (
                          <ActionButton onClick={() => onView(apt)} icon={Eye}>
                            View
                          </ActionButton>
                        )}
                        {onReschedule && (
                          <ActionButton onClick={() => onReschedule(apt)} icon={CalendarClock}>
                            Reschedule
                          </ActionButton>
                        )}
                        {onEdit && (
                          <ActionButton onClick={() => onEdit(apt)} icon={CalendarClock}>
                            Edit
                          </ActionButton>
                        )}
                        {onComplete && (
                          <ActionButton onClick={() => onComplete(apt)} icon={Eye} variant="success">
                            Complete
                          </ActionButton>
                        )}
                        {onCancel && (
                          <ActionButton onClick={() => onCancel(apt)} icon={XCircle} variant="danger">
                            Cancel
                          </ActionButton>
                        )}
                      </>
                    )}
                    {(apt.status === 'cancelled' || apt.status === 'completed') && onView && (
                      <ActionButton onClick={() => onView(apt)} icon={Eye}>
                        View
                      </ActionButton>
                    )}
                    {(apt.status === 'cancelled' || apt.status === 'completed') && !onView && (
                      <span className="text-sm text-text-muted">—</span>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
