const DOCTORS = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Davis', 'Dr. James Wilson']

export const DOCTOR_PROFILES = [
  { name: 'Dr. Sarah Johnson', specialization: 'General Practice', available: 'Mon–Fri, 9AM–5PM' },
  { name: 'Dr. Michael Chen', specialization: 'Cardiology', available: 'Tue–Thu, 10AM–4PM' },
  { name: 'Dr. Emily Davis', specialization: 'Pediatrics', available: 'Mon–Wed, 8AM–2PM' },
  { name: 'Dr. James Wilson', specialization: 'Dermatology', available: 'Mon–Fri, 2PM–6PM' },
]

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
]

const generateId = () => Math.random().toString(36).slice(2, 11)

export const mockAppointments = [
  {
    id: generateId(),
    patientName: 'John Smith',
    patientEmail: 'john@email.com',
    patientPhone: '555-0101',
    doctor: 'Dr. Sarah Johnson',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: 'booked',
    reason: 'Annual checkup',
  },
  {
    id: generateId(),
    patientName: 'Emma Wilson',
    patientEmail: 'emma@email.com',
    patientPhone: '555-0102',
    doctor: 'Dr. Michael Chen',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    status: 'booked',
    reason: 'Follow-up consultation',
  },
  {
    id: generateId(),
    patientName: 'Robert Brown',
    patientEmail: 'robert@email.com',
    patientPhone: '555-0103',
    doctor: 'Dr. Emily Davis',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    status: 'completed',
    reason: 'Vaccination',
  },
  {
    id: generateId(),
    patientName: 'Lisa Anderson',
    patientEmail: 'lisa@email.com',
    patientPhone: '555-0104',
    doctor: 'Dr. James Wilson',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '11:00',
    status: 'cancelled',
    reason: 'Consultation',
  },
  {
    id: generateId(),
    patientName: 'David Martinez',
    patientEmail: 'david@email.com',
    patientPhone: '555-0105',
    doctor: 'Dr. Sarah Johnson',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '15:00',
    status: 'booked',
    reason: 'Skin examination',
  },
]

export const mockPatients = [
  { id: '1', name: 'John Smith', phone: '555-0101', email: 'john@email.com', lastVisit: '2024-03-10', upcomingAppointment: 'Today, 9:00 AM' },
  { id: '2', name: 'Emma Wilson', phone: '555-0102', email: 'emma@email.com', lastVisit: '2024-02-15', upcomingAppointment: 'Today, 10:30 AM' },
  { id: '3', name: 'Robert Brown', phone: '555-0103', email: 'robert@email.com', lastVisit: '2024-03-12', upcomingAppointment: '—' },
  { id: '4', name: 'Lisa Anderson', phone: '555-0104', email: 'lisa@email.com', lastVisit: '2024-01-20', upcomingAppointment: '—' },
  { id: '5', name: 'David Martinez', phone: '555-0105', email: 'david@email.com', lastVisit: '2024-03-01', upcomingAppointment: 'Tomorrow, 3:00 PM' },
]

export { DOCTORS, TIME_SLOTS }
