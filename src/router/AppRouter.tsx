import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthGuard from "../components/AuthGuard";
import UserRoutes from "../pages/user/router/UserRoutes";
import CoachRoutes from "@/pages/coach/routes/CoachRoutes";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<Navigate to='/login' />} />

        <Route element={<AuthGuard />} >
          <Route path='/administrador/*' element={<CoachRoutes />} />
          <Route path='/coach/*' element={<CoachRoutes />} />
          <Route path='/usuario/*' element={<UserRoutes />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
