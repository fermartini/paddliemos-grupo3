import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'




const turnosEjemplo = [
    { id: 1, fecha: '2025-05-29', hora: '18:00', estado: 'Agendado' },
    { id: 2, fecha: '2025-05-27', hora: '20:00', estado: 'Cancelado' },
    { id: 3, fecha: '2025-05-25', hora: '19:00', estado: 'Agendado' },
    { id: 1, fecha: '2025-05-22', hora: '18:00', estado: 'Agendado' },
    { id: 2, fecha: '2025-05-04', hora: '20:00', estado: 'Cancelado' },
    { id: 3, fecha: '2025-05-12', hora: '19:00', estado: 'Agendado' },
]

function HistorialTurnos() {
    const [turnos, setTurnos] = useState(turnosEjemplo)
    const [busqueda, setBusqueda] = useState('')
    const navigate = useNavigate()

    const handleCancelar = (id) => {
        const nuevosTurnos = turnos.map(turno =>
            turno.id === id ? { ...turno, estado: 'Cancelado' } : turno
        )
        setTurnos(nuevosTurnos)
    }

    const turnosFiltrados = turnos.filter(turno =>
        turno.fecha.includes(busqueda)
    )

    return (
        <div className='bg-base-100 shadow-md rounded-xl p-6 mb-10 relative'>


            <div className="flex justify-end">
                <button
                    className='btn btn-sm btn-outline absolute top-4 right-4'
                    onClick={() => navigate('/perfil')}
                >
                    Ver perfil
                </button>
            </div>


            <div className="max-w-xl mx-auto mt-20 shadow-lg rounded-lg p-6">

                <h2 className="text-2xl font-bold text-center text-primary mb-4">
                    Historial de Turnos
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
                    {turnosFiltrados.map(turno => (
                        <li
                            key={turno.id}
                            className='flex justify-between items-center border-b border-base-300 pb-2'
                        >
                            <div>
                                <p className='font-medium'>
                                    {turno.fecha} - {turno.hora}
                                </p>
                            </div>

                            <div className='flex items-center gap-2'>
                                <span
                                    className={`badge badge-xs ${turno.estado === 'Cancelado' ? 'badge-error' : 'badge-success'
                                        }`}
                                >
                                    {turno.estado}
                                </span>


                                {turno.estado === 'Agendado' && (
                                    <button
                                        className='btn btn-xs btn-outline btn-error'
                                        onClick={() => handleCancelar(turno.id)}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>


    )
}

export default HistorialTurnos
