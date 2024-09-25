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
      if (error) {
        throw new Error(error.message);
      }
      if (data.user) {
        const { data: userWithRole } = await supabase.from("users").select("*").eq('user_id_auth', data.user.id).single();
        if (userWithRole) {
          if (userWithRole.role === 'admin') {
            navigate("/coach/dashboard");
          } else if (userWithRole.role === 'coach') {
            navigate("/user/dashboard");
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
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <img src="https://i.blogs.es/410bab/danielle-cerullo-cqfnt66ttzm-unsplash/1366_2000.webp" alt="Background" className="absolute inset-0 object-cover w-full h-full opacity-80" />
        <div className="bg-bg-100 dark:bg-bg-900 shadow-lg rounded-lg p-8 w-full max-w-md relative z-10 mx-4 sm:mx-0">
          <img src="/primary-logo.svg" alt="Primary Logo" className="mb-6 mx-auto w-48" />
          {error && <p className="text-accent-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold text-text-100 dark:text-text-900">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 placeholder-text-200 dark:placeholder-text-700 bg-bg-200 dark:bg-bg-800 border border-bg-300 dark:border-bg-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 font-semibold text-text-100 dark:text-text-900">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 placeholder-text-200 dark:placeholder-text-700 bg-bg-200 dark:bg-bg-800 border border-bg-300 dark:border-bg-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberSession"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="w-4 h-4 text-primary-500 border-bg-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="rememberSession" className="ml-2 text-sm text-text-100 dark:text-text-900">
                Recordar sesión
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-100 text-white p-3 rounded-lg hover:bg-accent-200 active:bg-accent-700 transition-all duration-300 transform hover:scale-102 active:scale-98 font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-opacity-50 uppercase tracking-wide"            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
