import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";
import { User } from "interfaces/types";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsOpen(false);
    fetchUser();
  }, [location]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id_auth", user.id)
        .single();
      setUser(userData);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="bg-primary-100 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Link
                to='/coach/dashboard'
                className='flex items-center space-x-3 rtl:space-x-reverse'
              >
                <img src="/assets/CUMBASGYM-blanco.png" alt="CUMBASGYM Logo" className="h-24 w-auto" />
              </Link>
              <span className="text-lg font-semibold hidden md:block">{user?.name} {user?.last_name}</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/coach/dashboard" label="Inicio" />
                <NavLink to="/coach/routines" label="Rutinas" />
                <NavLink to="/coach/exercises" label="Ejercicios" />
                <NavLink to="/coach/today-workout" label="Rutina de hoy" />
                <NavLink to="/coach/users" label="Usuarios" />
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-300"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Abrir menú</span>
                {!isOpen && (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex justify-end">
            <div className="w-[90%] sm:px-3 bg-white h-full flex flex-col justify-between">
              <div>
                <div className="bg-accent-200 p-2">
                  <div className="flex justify-end">
                    <button
                      onClick={toggleMenu}
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-300"
                    >
                      <span className="sr-only">Cerrar menú</span>
                      <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {user && (
                    <div className="rounded-lg pb-6">
                      <div className="flex items-center space-x-3">
                        <img src="/assets/CUMBASGYM-blanco.png" alt="User Avatar" className="w-24 h-24 rounded-full" />
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold">{user?.name} {user?.last_name}</span>
                          {/*TODO: Agregar el email al usuario */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <MobileNavLink to="/coach/dashboard" label="Inicio" />
                <MobileNavLink to="/coach/routines" label="Rutinas" />
                <MobileNavLink to="/coach/exercises" label="Ejercicios" />
                <MobileNavLink to="/coach/today-workout" label="Rutina de hoy" />
                <MobileNavLink to="/coach/users" label="Usuarios" />
                <div className="border-t border-bg-500 my-4"></div>
                <button
                  onClick={handleLogout}
                  className="pl-6 block px-3 py-3 rounded-md text-lg font-medium bg-white hover:bg-gray-100 text-gray-800 opacity-80 text-left hover:text-red-700"
                >
                  Cerrar sesión
                </button>
              </div>
              <span className="text-center text-xs text-gray-500 mb-8">
                Powered by
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-center items-center">
                  <img src="/primary-logo.svg" alt="primefit logo" />
                </a>
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === to
        ? "bg-gray-200 text-gray-900"
        : "text-white hover:bg-gray-100 hover:text-gray-900"
        }`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  return (
    <Link
      to={to}
      className={`pl-6 block px-3 py-3 rounded-md text-lg font-medium ${location.pathname === to
        ? "bg-gray-200 text-accent-200"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
    >
      {label}
    </Link>
  );
};
export default Nav;