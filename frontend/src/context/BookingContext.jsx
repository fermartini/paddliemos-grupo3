import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext)

export const BookingProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [bookingStep, setBookingStep] = useState(1)

  const courts = [
    { id: 1, name: 'Cancha 1', description: 'Cancha principal' },
    { id: 2, name: 'Cancha 2', description: 'Cancha secundaria' },
    { id: 3, name: 'Cancha 3', description: 'Cancha cubierta' }
  ]

  // despues lo traemos del back
  const generateTimeSlots = date => {
    console.log(date)
    return [
      { id: 1, start: '08:00', end: '09:00', available: true },
      { id: 2, start: '09:00', end: '10:00', available: true },
      { id: 3, start: '10:00', end: '11:00', available: false },
      { id: 4, start: '11:00', end: '12:00', available: true },
      { id: 5, start: '12:00', end: '13:00', available: true },
      { id: 6, start: '13:00', end: '14:00', available: false },
      { id: 7, start: '14:00', end: '15:00', available: true },
      { id: 8, start: '15:00', end: '16:00', available: true },
      { id: 9, start: '16:00', end: '17:00', available: true },
      { id: 10, start: '17:00', end: '18:00', available: false },
      { id: 11, start: '18:00', end: '19:00', available: true },
      { id: 12, start: '19:00', end: '20:00', available: true },
      { id: 13, start: '20:00', end: '21:00', available: true },
      { id: 14, start: '21:00', end: '22:00', available: true }
    ]
  }

  const resetBooking = () => {
    setSelectedDate(null)
    setSelectedCourt(null)
    setSelectedTimeSlot(null)
    setBookingStep(1)
  }

  const confirmBooking = async () => {
    // TODO: hacer la confirmación en el back
    console.log('Booking confirmed:', {
      date: selectedDate,
      courtId: selectedCourt?.id,
      timeSlot: selectedTimeSlot
    })

    // TODO: llamado a la api!
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, bookingId: Math.floor(Math.random() * 1000) })
      }, 500)
    })
  }

  const value = {
    selectedDate,
    setSelectedDate,
    selectedCourt,
    setSelectedCourt,
    selectedTimeSlot,
    setSelectedTimeSlot,
    bookingStep,
    setBookingStep,
    courts,
    generateTimeSlots,
    resetBooking,
    confirmBooking
  }

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}
