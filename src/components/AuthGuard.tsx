import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "../utils/supabaseClient";

const AuthGuard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === "SIGNED_IN") {
                    setIsAuthenticated(true);
                } else if (event === "SIGNED_OUT") {
                    setIsAuthenticated(false);
                }
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
