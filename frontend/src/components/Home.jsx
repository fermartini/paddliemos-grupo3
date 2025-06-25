import React, { useEffect, useState } from "react";
import { BookingProvider } from "../context/BookingContext";
import BookingWizard from "./BookingWizard";
import ThemeToggle from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Home() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const { user, logout } = useAuth();
  const name = user?.name.charAt(0).toUpperCase() + user?.name.slice(1);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/registro");
  };

  const handleLogoutClick = () => {
    logout();

    setLogoutMessage("¡Tu sesión ha sido cerrada con éxito!");
    setShowLogoutModal(true);

    setTimeout(() => {
      setShowLogoutModal(false);
      navigate("/");
    }, 2000);
  };

  return (
    <BookingProvider>
      <header className="bg-base-100 shadow-md py-4 flex flex-col md:flex-row  mx-10 justyfy-center gap-10 ">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={"/paddliemos.webp"} alt="logo" className="w-22 h-22" />
            <span>
              <h1 className="text-3xl font-bold text-primary">Paddliemos</h1>
              <p className="text-secondary">
                Sistema de reservas de canchas de paddle
              </p>
            </span>
          </div>
        </div>
        {user ? (
          <div>
            <div className="grid grid-cols-2 space-x-2 gap-6 align-end">
              <span className="text-lg font-semibold text-gray-500 md:text-nowrap">
                ¡Bienvenido, {name}!
              </span>
              <ThemeToggle />
              <Link
                to="/historialTurnos"
                className="btn btn-sm btn-primary text-nowrap"
              >
                Mis Turnos Previos
              </Link>
              <button
                className="btn btn-sm btn-error  "
                onClick={handleLogoutClick}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-end space-x-2 gap-4">
              <button
                className="btn btn-sm btn-primary mt-4"
                onClick={handleLoginClick}
              >
                Ingresar
              </button>
              <button
                className="btn btn-sm btn-secondary mt-4"
                onClick={handleRegisterClick}
              >
                Registrate
              </button>
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>
      <main className="min-h-screen bg-base-200 flex flex-col">
        <section className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-primary mb-2">
              Reservá tu turno
            </h2>
            <p className="text-lg text-secondary">
              ¡Reserva fácilmente tu cancha de paddle para jugar con amigos o
              practicar!
            </p>
          </div>
          {user ? (
            <div className="flex flex-col items-center gap-10">
              <BookingWizard />
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto">
              {" "}
              <article className="mt-8">
                <h2 className="text-3xl text-center font-semibold text-primary">
                  ¿Cómo funciona?
                </h2>
              </article>
              <aside className="mt-8">
                <section className="card bg-base-100 shadow-xl w-96 mx-auto">
                  <div className="card-body">
                    <ul>
                      <li>1. Elige una fecha disponible.</li>
                      <li>2. Selecciona un horario para tu turno.</li>
                      <li>3. Confirma tu reserva y ¡listo!</li>
                    </ul>
                  </div>
                </section>
              </aside>
            </div>
          )}
        </section>

        <footer className="bg-base-100 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © 2025 Paddliemos - Todos los derechos reservados
            </p>
          </div>
        </footer>
      </main>

      {showLogoutModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-success">¡Adiós!</h3>
            <p className="py-2">{logoutMessage}</p>
            <p className="py-2">Será redirigido a la pantalla principal.</p>
            <div className="modal-action"></div>
          </div>
        </div>
      )}
    </BookingProvider>
  );
}

export default Home;
