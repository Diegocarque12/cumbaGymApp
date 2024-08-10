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
      console.log(email, password);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        console.log(data.user);
        console.log(data.user.id);

        const { data: userWithRole } = await supabase.from("users").select("*").eq('user_id_auth', data.user.id).single();
        console.log(userWithRole);
        if (userWithRole) {
          console.log(userWithRole.role);
          if (userWithRole.role === 'couch') {
            navigate("/couch/dashboard");
          } else if (userWithRole.role === 'user') {
            navigate("/user/dashboard");
          }
        }
        // console.log('Usuario autenticado:', data.user);
        setRememberSession(true);
        // navigate("/couch/dashboard");
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
        </div>
      </div>
    </>
  );
};

export default LoginPage;
