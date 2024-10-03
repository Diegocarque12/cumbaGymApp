import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthGuard from "../components/AuthGuard";
import AdminRoutes from "@/pages/admin/routes/AdminRoutes";
import CoachRoutes from "@/pages/coach/routes/CoachRoutes";
import UserRoutes from "../pages/user/router/UserRoutes";
import SignUpPage from "@/pages/SignUpPage";
import SignUpConfirmationPage from "@/pages/SignUpConfirmationPage";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/signup/confirmation' element={<SignUpConfirmationPage />} />

        <Route element={<AuthGuard />} >
          <Route path='/admin/*' element={<AdminRoutes />} />
          <Route path='/coach/*' element={<CoachRoutes />} />
          <Route path='/user/*' element={<UserRoutes />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
