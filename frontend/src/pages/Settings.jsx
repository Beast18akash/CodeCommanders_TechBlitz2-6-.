import { PageHeader } from '../components/ui'

export default function Settings() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your clinic preferences"
      />

      <div className="card">
        <p className="text-text-muted">
          Settings page coming soon. Configure clinic hours, notifications, and more.
        </p>
      </div>
    </div>
  )
}
