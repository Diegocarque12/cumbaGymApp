import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";
// import supabase from "../utils/supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberSession, setRememberSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      //TODO: Check if is necessary to save  the token in sessionStorage or localStorage
      if (data.session?.access_token) {
        sessionStorage.setItem('access_token', data.session.access_token);
        if (rememberSession) {
          localStorage.setItem('access_token', data.session.access_token);
        }
      }
      if (error) {
        throw new Error(error.message);
      }
      if (data.user) {
        const { data: userWithRole } = await supabase.from("profiles").select("*").eq('auth_id', data.user.id).single();
        if (userWithRole) {
          if (userWithRole.role === 'admin') {
            navigate("/admin/dashboard");
          } else if (userWithRole.role === 'coach') {
            navigate("/coach/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }
        setRememberSession(true);
      } else {
        throw new Error("No se pudo autenticar al usuario");
      }
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black relative">
        <img src="https://i.blogs.es/410bab/danielle-cerullo-cqfnt66ttzm-unsplash/1366_2000.webp" alt="Background" className="absolute inset-0 object-cover opacity-80 w-full h-full" />
        <div className="bg-card dark:bg-card-foreground shadow-lg rounded-lg p-8 w-full max-w-md relative z-10">
          <h2 className="text-3xl font-bold text-primary dark:text-primary-foreground mb-6 text-center">👋 Hola de nuevo!</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-bold text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-bold text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="rememberSession"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberSession" className="text-sm text-gray-700">
                Recordar sesión
              </label>
            </div>

            <button type="submit" className="w-full bg-accent text-accent-foreground p-3 rounded-lg hover:bg-accent/80 transition-colors duration-500 transform hover:scale-105 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50">Iniciar Sesión</button>          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">¿No tienes una cuenta?</p>
            <button
              onClick={() => { navigate("/signup") }}
              className="mt-2 w-full bg-secondary text-secondary-foreground p-3 rounded-lg hover:bg-secondary/80 transition-colors duration-500 transform hover:scale-105 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
            >
              Registrarse
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default LoginPage;
