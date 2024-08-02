import { Navigate, Route, Routes } from "react-router-dom";
import CouchRoutes from "../pages/couch/routes/CouchRoutes";
import LoginPage from "../pages/LoginPage";
import AuthGuard from "../components/AuthGuard";
import UserRoutes from "../pages/user/router/UserRoutes";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<Navigate to='/login' />} />

        <Route element={<AuthGuard />} >
          <Route path='/couch/*' element={<CouchRoutes />} />
          <Route path='/user/*' element={<UserRoutes />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
