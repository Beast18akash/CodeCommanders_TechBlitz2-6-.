import { useState, useMemo } from 'react'
import Modal from '../components/Modal'
import { PageHeader } from '../components/ui'
import { useAppointments } from '../context/AppointmentsContext'
import { Plus, Search, User } from 'lucide-react'

function PatientAvatar({ name, size = 'md' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
  const sizeClasses = size === 'lg' ? 'h-16 w-16 text-lg' : 'h-10 w-10 text-sm'
  return (
    <div className={`${sizeClasses} rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold shrink-0`}>
      {initials}
    </div>
  )
}

export default function Patients() {
  const { patients, addPatient } = useAppointments()
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients
    const s = search.toLowerCase()
    return patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(s) ||
        p.email?.toLowerCase().includes(s) ||
        p.phone?.includes(search)
    )
  }, [patients, search])

  const handleAddPatient = (e) => {
    e.preventDefault()
    if (!newPatient.name || !newPatient.phone || !newPatient.email) return
    addPatient(newPatient)
    setNewPatient({ name: '', phone: '', email: '' })
    setAddModalOpen(false)
  }

  const handleViewProfile = (patient) => {
    setSelectedPatient(patient)
    setProfileModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Patient Management"
        subtitle="Manage patient records and profiles"
        action={
          <button onClick={() => setAddModalOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Patient
          </button>
        }
      />

      <div className="card">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Phone</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Last Visit</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Upcoming</th>
                <th className="text-right py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <User className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                      <p className="font-semibold text-text-dark">No patients registered yet</p>
                      <p className="text-sm text-text-muted mt-1 max-w-sm">
                        Add your first patient to get started with the patient management dashboard.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <PatientAvatar name={patient.name} />
                        <p className="font-medium text-text-dark">{patient.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text-dark">{patient.phone}</td>
                    <td className="py-4 px-4 text-text-dark">{patient.email}</td>
                    <td className="py-4 px-4 text-text-dark">{patient.lastVisit}</td>
                    <td className="py-4 px-4 text-text-dark">{patient.upcomingAppointment}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleViewProfile(patient)}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Patient">
        <form onSubmit={handleAddPatient} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Name *</label>
            <input
              type="text"
              value={newPatient.name}
              onChange={(e) => setNewPatient((p) => ({ ...p, name: e.target.value }))}
              className="input-field"
              placeholder="Full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Phone *</label>
            <input
              type="tel"
              value={newPatient.phone}
              onChange={(e) => setNewPatient((p) => ({ ...p, phone: e.target.value }))}
              className="input-field"
              placeholder="555-0000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Email *</label>
            <input
              type="email"
              value={newPatient.email}
              onChange={(e) => setNewPatient((p) => ({ ...p, email: e.target.value }))}
              className="input-field"
              placeholder="patient@email.com"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">Add Patient</button>
            <button type="button" onClick={() => setAddModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Patient Profile"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <PatientAvatar name={selectedPatient.name} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-text-dark">{selectedPatient.name}</h3>
                <p className="text-sm text-text-muted">Patient ID: {selectedPatient.id}</p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <p className="text-sm text-text-muted">Phone</p>
                <p className="font-medium text-text-dark mt-1">{selectedPatient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Email</p>
                <p className="font-medium text-text-dark mt-1">{selectedPatient.email}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Last Appointment</p>
                <p className="font-medium text-text-dark mt-1">{selectedPatient.lastVisit}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Upcoming Appointment</p>
                <p className="font-medium text-text-dark mt-1">{selectedPatient.upcomingAppointment}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Medical Notes</p>
                <p className="text-sm text-text-muted mt-1 italic">No notes recorded yet.</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
