import StatusBadge from './StatusBadge'

export default function AppointmentCard({
  appointment,
  onClick,
  formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  formatTime = (t) => (t ? `${parseInt(t.split(':')[0], 10) % 12 || 12}:${t.split(':')[1]} ${parseInt(t.split(':')[0], 10) >= 12 ? 'PM' : 'AM'}` : '—'),
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`rounded-xl border border-slate-200/80 bg-white p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 ${onClick ? '' : 'cursor-default'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-dark truncate">{appointment.patientName}</p>
          <p className="text-sm text-text-muted mt-0.5">{appointment.doctor}</p>
          <p className="text-sm text-text-muted mt-1">
            {formatDate(appointment.date)} • {formatTime(appointment.time)}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
    </div>
  )
}
