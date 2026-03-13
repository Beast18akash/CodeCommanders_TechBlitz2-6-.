import { createContext, useContext, useState, useCallback } from 'react'
import { mockAppointments, mockPatients, DOCTORS, TIME_SLOTS, DOCTOR_PROFILES } from '../data/mockData'

const AppointmentsContext = createContext(null)

const generateId = () => Math.random().toString(36).slice(2, 11)

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [patients, setPatients] = useState(mockPatients)

  const addAppointment = useCallback((data) => {
    const newApt = {
      id: generateId(),
      ...data,
      status: 'booked',
    }
    setAppointments((prev) => [...prev, newApt].sort((a, b) => {
      const dateCompare = new Date(a.date) - new Date(b.date)
      if (dateCompare !== 0) return dateCompare
      return (a.time || '').localeCompare(b.time || '')
    }))
    return newApt
  }, [])

  const updateAppointment = useCallback((id, updates) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    )
  }, [])

  const cancelAppointment = useCallback((id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    )
  }, [])

  const completeAppointment = useCallback((id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'completed' } : apt))
    )
  }, [])

  const addPatient = useCallback((data) => {
    const newPatient = {
      id: generateId(),
      ...data,
      lastVisit: '—',
      upcomingAppointment: '—',
    }
    setPatients((prev) => [...prev, newPatient])
    return newPatient
  }, [])

  const getBookedSlots = useCallback((date, doctor) => {
    return appointments
      .filter((a) => a.date === date && a.doctor === doctor && a.status === 'booked')
      .map((a) => a.time)
  }, [appointments])

  const getAppointmentsByDate = useCallback((date) => {
    return appointments.filter((a) => a.date === date)
  }, [appointments])

  const value = {
    appointments,
    patients,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    addPatient,
    getBookedSlots,
    getAppointmentsByDate,
    DOCTORS,
    DOCTOR_PROFILES,
    TIME_SLOTS,
  }

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentsProvider')
  }
  return context
}
