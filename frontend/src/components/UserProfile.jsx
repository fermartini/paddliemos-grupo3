import React, { useState } from 'react'
import { X, User, Mail, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function UserProfile ({ abierto, cerrar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState('')

  if (!abierto) return null

  const handleLogoutClick = () => {
    logout()
    setLogoutMessage('¡Tu sesión ha sido cerrada con éxito!')
    setShowLogoutModal(true)

    setTimeout(() => {
      setShowLogoutModal(false)
      cerrar() // Close the profile modal
      navigate('/')
    }, 2000)
  }

  /*   const formatearFechaTurno = fechaISO => {
    if (!fechaISO) return 'N/A'
    return new Date(fechaISO).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
 */
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-base-100 rounded-xl shadow-xl w-full max-w-sm relative animate-fade-in-up border-2 border-primary'>
        <div className='flex justify-between items-center p-4 border-b border-base-300'>
          <h2 className='text-2xl font-bold text-primary'>Usuario</h2>
          <button
            onClick={cerrar}
            className='p-2 rounded-full hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 focus:ring-base-300'
          >
            <X className='w-6 h-6 text-base-content' />
          </button>
        </div>

        <div className='p-6'>
          <div className='flex justify-center mb-8'>
            <div className='w-24 h-24 bg-primary-focus/20 rounded-full flex items-center justify-center border-2 border-primary shadow-md'>
              <User className='w-12 h-12 text-primary' />
            </div>
          </div>

          <div className='space-y-5 mb-8'>
            <div className='flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start'>
              <User className='w-5 h-5 text-base-content shrink-0' />
              <div className='flex-grow'>
                <p className='text-sm text-base-content text-center sm:text-left'>
                  Nombre Completo
                </p>
                <p className='font-semibold text-base-content text-lg text-center sm:text-left'>
                  {user?.name || 'No disponible'}
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start'>
              <Mail className='w-5 h-5 text-base-content shrink-0' />
              <div className='flex-grow'>
                <p className='text-sm text-base-content text-center sm:text-left'>
                  Correo Electrónico
                </p>
                <p className='font-semibold text-base-content text-lg text-center sm:text-left'>
                  {user?.email || 'No disponible'}
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start'>
              <Calendar className='w-5 h-5 text-base-content shrink-0' />
              <div className='flex-grow'>
                <p className='text-sm text-base-content text-center sm:text-left'>
                  Próximo Turno
                </p>
                <p className='font-semibold text-base-content text-lg text-center sm:text-left'>
                  No tienes turnos agendados.
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <button
              className='btn btn-error w-full text-lg'
              onClick={handleLogoutClick}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Logout Success Modal */}
      {showLogoutModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60'>
          <div className='bg-base-100 rounded-xl shadow-xl p-6 max-w-sm mx-4 text-center'>
            <div className='text-success mb-4'>
              <svg
                className='w-16 h-16 mx-auto'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>¡Sesión Cerrada!</h3>
            <p className='text-base-content'>{logoutMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
