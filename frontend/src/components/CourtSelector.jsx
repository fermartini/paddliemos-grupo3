import React from 'react'
import { useBooking } from '../context/BookingContext'

const CourtSelector = () => {
  const { courts, selectedCourt, setSelectedCourt, setBookingStep } =
    useBooking()

  const handleCourtSelect = court => {
    setSelectedCourt(court)
    setBookingStep(3)
  }

  const handleBack = () => {
    setBookingStep(1)
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title text-primary'>Selecciona una cancha</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          {courts.map(court => (
            <div
              key={court.id}
              onClick={() => handleCourtSelect(court)}
              className={`card bg-base-200 cursor-pointer transition-all hover:bg-primary hover:text-white
                ${
                  selectedCourt?.id === court.id ? 'bg-primary text-white' : ''
                }`}
            >
              <div className='card-body p-4'>
                <h3 className='card-title text-lg'>{court.name}</h3>
                <p>{court.description}</p>
              </div>
            </div>
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

export default CourtSelector
