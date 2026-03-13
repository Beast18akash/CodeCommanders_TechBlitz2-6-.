const statusConfig = {
  booked: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    label: 'Booked',
  },
  completed: {
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Completed',
  },
  cancelled: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    label: 'Cancelled',
  },
  rescheduled: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    label: 'Rescheduled',
  },
  pending: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    label: 'Pending',
  },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  )
}
