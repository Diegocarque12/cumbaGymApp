import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabaseClient";

export const useCheckRole = (requiredRole: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.role !== requiredRole) {
        await supabase.auth.signOut();
        console.error(
          `You are not authorized to access this page. Required role: ${requiredRole}`
        );
        navigate("/login", { replace: true });
      }
    };
    checkUserRole();
  }, [requiredRole, navigate]);
};
