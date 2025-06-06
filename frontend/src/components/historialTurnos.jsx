import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, User, Mail, Calendar, LogOut } from "lucide-react"

const turnosEjemplo = [
    { id: 1, fecha: '2025-05-29', hora: '18:00', estado: 'Agendado' },
    { id: 2, fecha: '2025-05-27', hora: '20:00', estado: 'Cancelado' },
    { id: 3, fecha: '2025-05-25', hora: '19:00', estado: 'Agendado' },
    { id: 4, fecha: '2025-05-22', hora: '18:00', estado: 'Agendado' },
    { id: 5, fecha: '2025-05-04', hora: '20:00', estado: 'Cancelado' },
    { id: 6, fecha: '2025-05-12', hora: '19:00', estado: 'Agendado' },
]

function PerfilUsuario({ abierto, cerrar }) {
    if (!abierto) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">

                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Perfil de Usuario</h2>
                    <button onClick={cerrar} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>


                <div className="p-6">
                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-500" />
                        </div>
                    </div>


                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Nombre</p>
                                <p className="font-medium text-gray-900">Anna Clara</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">Annaclara@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Próximo turno</p>
                                <p className="font-medium text-green-600">01/06/2025 - 20:00 hs</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-3">
                        <button
                            onClick={cerrar}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cerrar
                        </button>
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function HistorialTurnos() {
    const [turnos, setTurnos] = useState(turnosEjemplo)
    const [busqueda, setBusqueda] = useState('')
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [turnoAConfirmar, setTurnoAConfirmar] = useState(null)
    const [mostrarPerfil, setMostrarPerfil] = useState(false) // Estado para controlar modal perfil
    const navigate = useNavigate()

    const handleAbrirConfirmacion = (turno) => {
        setTurnoAConfirmar(turno)
        setMostrarConfirmacion(true)
    }

    const handleCerrarConfirmacion = () => {
        setTurnoAConfirmar(null)
        setMostrarConfirmacion(false)
    }

    const handleConfirmarCancelacion = () => {
        if (turnoAConfirmar) {
            const nuevosTurnos = turnos.map(turno =>
                turno.id === turnoAConfirmar.id &&
                    turno.fecha === turnoAConfirmar.fecha &&
                    turno.hora === turnoAConfirmar.hora
                    ? { ...turno, estado: 'Cancelado' }
                    : turno
            )
            setTurnos(nuevosTurnos)
            setTurnoAConfirmar(null)
            setMostrarConfirmacion(false)
        }
    }

    const formatearFecha = (fechaISO) => {
        return new Date(fechaISO).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const turnosFiltrados = turnos.filter(turno =>
        turno.fecha.includes(busqueda)
    )

    return (
        <div className='bg-base-100 shadow-md rounded-xl p-6 mb-10 relative'>

            <div className="flex justify-end">
                <button
                    className='btn btn-sm btn-outline absolute top-4 right-4'
                    onClick={() => setMostrarPerfil(true)}
                >
                    Ver perfil
                </button>
            </div>

            {/* Mostrar modal PerfilUsuario */}
            {mostrarPerfil && <PerfilUsuario abierto={mostrarPerfil} cerrar={() => setMostrarPerfil(false)} />}

            <div className="max-w-xl mx-auto mt-20 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-primary mb-4">
                    Mis Últimos Turnos
                </h2>
            </div>

            <div className='mb-4 flex gap-2 items-center'>
                <input
                    type='date'
                    className='input input-bordered w-full max-w-xs'
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button
                    className='btn btn-outline'
                    onClick={() => setBusqueda('')}
                >
                    Limpiar
                </button>
            </div>

            {turnosFiltrados.length === 0 ? (
                <p className='text-secondary'>No se encontraron turnos para esa fecha.</p>
            ) : (
                <ul className='space-y-3'>
                    {turnosFiltrados.map((turno, index) => (
                        <li
                            key={`${turno.id}-${turno.fecha}-${turno.hora}-${index}`}
                            className='flex justify-between items-center border-b border-base-300 pb-2'
                        >
                            <div>
                                <p className='font-medium'>
                                    {turno.fecha} - {turno.hora}
                                </p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span
                                    className={`badge badge-xs ${turno.estado === 'Cancelado' ? 'badge-error' : 'badge-success'}`}
                                >
                                    {turno.estado}
                                </span>
                                {turno.estado === 'Agendado' && (
                                    <button
                                        className='btn btn-xs btn-outline btn-error'
                                        onClick={() => handleAbrirConfirmacion(turno)}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}


            {mostrarConfirmacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar cancelación de turno</h3>
                            {turnoAConfirmar && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700">
                                        ¿Estás seguro que deseas cancelar el turno del{' '}
                                        <span className="font-medium">{formatearFecha(turnoAConfirmar.fecha)}</span> a las{' '}
                                        <span className="font-medium">{turnoAConfirmar.hora} hs</span>?
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCerrarConfirmacion}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    No, mantener turno
                                </button>
                                <button
                                    onClick={handleConfirmarCancelacion}
                                    className="flex-1 px-4 py-2 text-white rounded-lg transition-colors"
                                    style={{ backgroundColor: '#12820e' }}
                                >
                                    Sí, cancelar turno
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default HistorialTurnos
