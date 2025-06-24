import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login () {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [errores, setErrores] = useState({})
  const navigate = useNavigate()
  const { login, errors, loading, successMessage, showSuccessModal } = useAuth()

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleGoBack = () => {
    navigate('/')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setErrores({})

    const nuevosErrores = {}
    if (!formData.username.trim()) {
      nuevosErrores.username = 'El usuario es requerido.'
    }
    if (!formData.password.trim()) {
      nuevosErrores.password = 'La contraseña es requerida.'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    try {
      await login(
        formData.username,
        formData.password,
        '¡Sesión iniciada con éxito!'
      )
    } catch (error) {
      console.error('Error en el login:', error)
      setErrores({
        general:
          'No se pudo conectar con el servidor. Verifique que el backend esté funcionando.'
      })
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-200'>
      <div className='bg-base-100 shadow-md rounded-lg p-8 w-full max-w-md'>
        <h2 className='text-2xl font-semibold mb-4 text-primary'>
          Iniciar Sesión
        </h2>

        {/* Información sobre AD */}
        <div className='alert alert-info mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='stroke-current shrink-0 w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
          <span>Use sus credenciales de Active Directory o cuenta local</span>
        </div>

        {(errores.general || errors.general) && (
          <div className='alert alert-error mb-4'>
            {errores.general || errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='username'
            >
              Usuario:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='username'
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Ingrese su usuario (ej: Pedro.Gonzalez)'
            />
            {errores.username && (
              <p className='text-red-500 text-xs italic'>{errores.username}</p>
            )}
          </div>
          <div>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Contraseña:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Ingrese su contraseña'
            />
            {errores.password && (
              <p className='text-red-500 text-xs italic'>{errores.password}</p>
            )}
          </div>
          <div className='w-40 mx-auto flex flex-col space-y-2'>
            <button
              type='submit'
              className='btn btn-primary rounded-lg w-full text-black'
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <button
              type='button'
              onClick={handleGoBack}
              className='btn btn-secondary rounded-lg w-full text-black'
            >
              Volver
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className='modal modal-open backdrop-blur-sm'>
          <div className='modal-box'>
            <h3 className='font-bold text-lg text-success'>¡Éxito!</h3>
            <p className='py-2'>{successMessage}</p>
            <p className='py-2'>
              Aguarde unos instantes, será redirigido a la página principal.
            </p>
            <div className='modal-action'></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
