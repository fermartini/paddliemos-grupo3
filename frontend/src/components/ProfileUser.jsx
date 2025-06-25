import React from "react";
import { X, User, Mail, Calendar, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function ProfileUser({ abierto, cerrar }) {
  if (!abierto) return null; // Não renderiza nada se 'abierto' for falso

  const { user, logout } = useAuth();
  const handleLogoutClick = () => {
    logout();

    setLogoutMessage("¡Tu sesión ha sido cerrada con éxito!");
    setShowLogoutModal(true);

    setTimeout(() => {
      setShowLogoutModal(false);
      navigate("/");
    }, 2000);
  };

  const formatearFechaTurno = (fechaISO) => {
    if (!fechaISO) return "N/A";
    return new Date(fechaISO).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-sm relative animate-fade-in-up border-2 border-primary">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h2 className="text-2xl font-bold text-primary">Usuario</h2>
          <button
            onClick={cerrar}
            className="p-2 rounded-full hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 focus:ring-base-300"
          >
            <X className="w-6 h-6 text-base-content" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-primary-focus/20 rounded-full flex items-center justify-center border-2 border-primary shadow-md">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <div className="flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start">
              <User className="w-5 h-5 text-base-content shrink-0" />
              <div className="flex-grow">
                <p className="text-sm text-base-content text-center sm:text-left">
                  Nombre Completo
                </p>
                <p className="font-semibold text-base-content text-lg text-center sm:text-left">
                  {user.name || "No disponible"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start">
              <Mail className="w-5 h-5 text-base-content shrink-0" />
              <div className="flex-grow">
                <p className="text-sm text-base-content text-center sm:text-left">
                  Correo Electrónico
                </p>
                <p className="font-semibold text-base-content text-lg text-center sm:text-left">
                  {user.email || "No disponible"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-3 bg-base-200 rounded-lg sm:flex-row sm:items-start">
              <Calendar className="w-5 h-5 text-base-content shrink-0" />
              <div className="flex-grow">
                <p className="text-sm text-base-content text-center sm:text-left">
                  Próximo Turno
                </p>
                {0 ? (
                  <p className="font-semibold text-primary text-lg text-center sm:text-left">
                    {formatearFechaTurno(proximoTurno.fecha)} - {0} hs
                  </p>
                ) : (
                  <p className="font-semibold text-base-content text-lg text-center sm:text-left">
                    No tienes turnos agendados.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              className="btn btn-error w-full text-lg"
              onClick={handleLogoutClick}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;
