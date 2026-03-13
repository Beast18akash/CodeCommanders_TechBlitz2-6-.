import { PageHeader } from '../components/ui'
import { BarChart3 } from 'lucide-react'

export default function Reports() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        subtitle="Clinic analytics and performance reports"
      />

      <div className="card">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <BarChart3 className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <p className="font-semibold text-text-dark text-lg">Reports coming soon</p>
          <p className="text-sm text-text-muted mt-2 max-w-sm">
            Analytics, appointment trends, and performance reports will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}
