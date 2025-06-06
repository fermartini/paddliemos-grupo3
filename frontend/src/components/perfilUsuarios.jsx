import { X, User, Mail, Calendar, LogOut } from "lucide-react"

function PerfilUsuario({ abierto, cerrar }) {
    if (!abierto) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
                {/* Header del modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Perfil de Usuario</h2>
                    <button onClick={cerrar} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="p-6">
                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-500" />
                        </div>
                    </div>

                    {/* Información del usuario */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Nombre</p>
                                <p className="font-medium text-gray-900">Juan Pérez</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">juan.perez@email.com</p>
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

                    {/* Botones */}
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

export default PerfilUsuario
