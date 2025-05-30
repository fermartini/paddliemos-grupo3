import React, { useState } from 'react'
import { useBooking } from '../context/BookingContext'

const BookingConfirmation = () => {
  const {
    selectedDate,
    selectedCourt,
    selectedTimeSlot,
    setBookingStep,
    confirmBooking,
    resetBooking
  } = useBooking()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      const result = await confirmBooking()
      setBookingResult(result)
      setBookingComplete(true)
    } catch (error) {
      console.error('Error confirming booking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setBookingStep(3)
  }

  const handleNewBooking = () => {
    resetBooking()
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

  if (bookingComplete) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <div className='text-center'>
            <div className='text-5xl text-success mb-4'>✓</div>
            <h2 className='card-title text-primary justify-center mb-2'>
              ¡Reserva Confirmada!
            </h2>
            <p>Tu reserva ha sido confirmada con éxito.</p>
            <p className='font-medium mt-4'>
              Número de reserva: #{bookingResult?.bookingId}
            </p>

            <div className='divider'></div>

            <div className='text-left'>
              <p>
                <span className='font-medium'>Fecha:</span>{' '}
                {formatDate(selectedDate)}
              </p>
              <p>
                <span className='font-medium'>Cancha:</span>{' '}
                {selectedCourt?.name}
              </p>
              <p>
                <span className='font-medium'>Horario:</span>{' '}
                {selectedTimeSlot?.start} - {selectedTimeSlot?.end}
              </p>
            </div>

            <button onClick={handleNewBooking} className='btn btn-primary mt-6'>
              Hacer otra reserva
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title text-primary'>Confirmar Reserva</h2>

        <div className='mt-4'>
          <p>
            <span className='font-medium'>Fecha:</span>{' '}
            {formatDate(selectedDate)}
          </p>
          <p>
            <span className='font-medium'>Cancha:</span> {selectedCourt?.name}
          </p>
          <p>
            <span className='font-medium'>Horario:</span>{' '}
            {selectedTimeSlot?.start} - {selectedTimeSlot?.end}
          </p>
        </div>

        <div className='card-actions justify-between mt-6'>
          <button
            onClick={handleBack}
            className='btn btn-outline'
            disabled={isSubmitting}
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
