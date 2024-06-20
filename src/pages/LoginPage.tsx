import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import supabase from "../utils/supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // const { user, error } = await supabase.auth.signIn({ email, password });

      if (error) {
        // throw new Error(error.message);
      }

      // Redirigir al usuario a la página principal después de iniciar sesión
      navigate("/dashboard");
    } catch (err) {
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
