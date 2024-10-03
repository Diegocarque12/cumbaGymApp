import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";

const SignUpConfirmationPage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                try {
                    const { data, error } = await supabase.auth.getSession();
                    if (data.session) {
                        setMessage("¡Correo confirmado exitosamente! Redirigiendo al dashboard...");
                        setTimeout(() => navigate("/dashboard"), 3000);
                    } else if (error) {
                        throw new Error(error.message);
                    }
                } catch (err) {
                    console.error(err);
                    setError("Error al confirmar el correo. Por favor, inténtalo de nuevo.");
                }
            } else {
                setMessage("Esperando confirmación de correo...");
            }
        };

        handleEmailConfirmation();

        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                setMessage("Sesión iniciada. Redirigiendo al dashboard...");
                setTimeout(() => navigate("/administrador"), 3000);
            }
        });
        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black relative">
            <img src="https://i.blogs.es/410bab/danielle-cerullo-cqfnt66ttzm-unsplash/1366_2000.webp" alt="Background" className="absolute inset-0 object-cover opacity-80 w-full h-full" />
            <div className="bg-card dark:bg-card-foreground shadow-lg rounded-lg p-8 w-full max-w-md relative z-10">
                <h2 className="text-3xl font-bold text-primary dark:text-primary-foreground mb-6 text-center">Confirmación de Registro</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
                {!message && !error && (
                    <p className="text-gray-600 text-center">
                        Por favor, espera mientras confirmamos tu correo electrónico...
                    </p>
                )}
            </div>
        </div>
    );
};

export default SignUpConfirmationPage;