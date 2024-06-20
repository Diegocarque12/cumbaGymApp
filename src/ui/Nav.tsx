import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href='/dashboard'
              className='flex items-center space-x-3 rtl:space-x-reverse'
            >
              <img
                src='https://flowbite.com/docs/images/logo.svg'
                className='h-8'
                alt='Flowbite Logo'
              />
              <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
                CumbaGym
              </span>
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === "/dashboard"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  Inicio
                </Link>
                <Link
                  to="/routines"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === "/routines"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  Rutinas
                </Link>
                <Link
                  to="/exercises"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === "/exercises"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  Ejercicios
                </Link>
                <Link
                  to="/today-workout"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === "/today-workout"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  Rutina de hoy
                </Link>
                <Link
                  to="/users"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === "/users"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}>
                  Usuarios
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;