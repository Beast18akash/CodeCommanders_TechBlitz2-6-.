const colorConfig = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    accent: 'border-l-primary',
  },
  secondary: {
    bg: 'bg-secondary/10',
    icon: 'text-secondary',
    accent: 'border-l-secondary',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
    accent: 'border-l-success',
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'text-warning',
    accent: 'border-l-warning',
  },
  danger: {
    bg: 'bg-danger/10',
    icon: 'text-danger',
    accent: 'border-l-danger',
  },
}

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary' }) {
  const config = colorConfig[color] || colorConfig.primary

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 border-l-4 ${config.accent}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="text-2xl font-bold text-text-dark mt-2 tabular-nums">{value}</p>
          {trend && (
            <p className="text-xs text-text-muted mt-2">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.icon}`}>
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  )
}
