import React from 'react'
import { useMemo } from 'react'
import { useBooking } from '../context/BookingContext'

const TimeSlotSelector = () => {
  const {
    selectedDate,
    selectedCourt,
    selectedTimeSlot,
    setSelectedTimeSlot,
    setBookingStep,
    generateTimeSlots
  } = useBooking()

  // get  timeslots
  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedCourt) return []
    return generateTimeSlots(selectedDate)
  }, [selectedDate, selectedCourt, generateTimeSlots])

  const handleTimeSlotSelect = timeSlot => {
    if (!timeSlot.available) return
    setSelectedTimeSlot(timeSlot)
    setBookingStep(4) // move to confirmation
  }

  const handleBack = () => {
    setBookingStep(2) // go to court selection
  }

  // Format date for display
  const formatDate = date => {
    if (!date) return ''
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return date.toLocaleDateString('es-ES', options)
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title text-primary'>Selecciona un horario</h2>
        <p className='text-sm mb-2'>
          {selectedCourt?.name} - {formatDate(selectedDate)}
        </p>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4'>
          {timeSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => handleTimeSlotSelect(slot)}
              disabled={!slot.available}
              className={`btn ${
                selectedTimeSlot?.id === slot.id
                  ? 'btn-primary'
                  : slot.available
                  ? 'btn-outline'
                  : 'btn-disabled'
              }`}
            >
              {slot.start} - {slot.end}
            </button>
          ))}
        </div>

        <div className='card-actions justify-between mt-6'>
          <button onClick={handleBack} className='btn btn-outline'>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeSlotSelector
