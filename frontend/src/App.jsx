import React from 'react'
import './App.css'
import { BookingProvider } from './context/BookingContext'
import BookingWizard from './components/BookingWizard'
import ThemeToggle from './components/ThemeToggle'

function App () {
  return (
    <BookingProvider>
      <main className='min-h-screen bg-base-200 flex flex-col'>
        <header className='bg-base-100 shadow-md py-4'>
          <div className='container mx-auto px-4 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <img src={'/paddliemos.webp'} alt='logo' className='w-22 h-22' />
              <span>
                <h1 className='text-3xl font-bold text-primary'>Paddliemos</h1>
                <p className='text-secondary'>
                  Sistema de reservas de canchas de paddle
                </p>
              </span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <section className='container mx-auto px-4 py-8 flex-grow'>
          <div className='text-center mb-8'>
            <h2 className='text-4xl font-bold text-primary mb-2'>
              Reservá tu turno
            </h2>
            <p className='text-lg text-secondary'>
              ¡Reserva fácilmente tu cancha de paddle para jugar con amigos o
              practicar!
            </p>
          </div>

          <BookingWizard />
        </section>

        <footer className='bg-base-100 py-6'>
          <div className='container mx-auto px-4 text-center'>
            <p className='text-sm'>
              © 2025 Paddliemos - Todos los derechos reservados
            </p>
          </div>
        </footer>
      </main>
    </BookingProvider>
  )
}

export default App
