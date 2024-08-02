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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-black">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Cumba Gym
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
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
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="rememberSession"
              checked={rememberSession}
              onChange={(e) => setRememberSession(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberSession" className="text-sm text-gray-600">
              Recordar sesión
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
