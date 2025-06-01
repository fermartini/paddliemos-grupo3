import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PerfilUsuario({ abierto, cerrar }) {
    if (!abierto) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-base-100 p-6 rounded-xl shadow-lg w-[90%] max-w-md'>
                <h2 className='text-2xl font-bold mb-4'>Perfil de Usuario</h2>
                <p><strong>Nombre:</strong> Anna de Souza </p>
                <p><strong>Email:</strong> Annacarag@gmail.com</p>
                <p><strong>Turno actual:</strong> 01/06/2025 - 20:00 hs</p>

                <div className='mt-4 flex justify-between'>
                    <button className='btn btn-outline' onClick={cerrar}>Cerrar</button>
                    <button className='btn btn-error'>Encerrar cuenta</button>
                </div>
            </div>
        </div>
    )
}

export default PerfilUsuario