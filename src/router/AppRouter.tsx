import { Route, Routes } from "react-router-dom";
// import LoginPage from "../auth/LoginPage";
import { CouchRoutes } from "../couch/routes/CouchRoutes";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* <Route path='login' element={<LoginPage />} /> */}
        {/* <Route path='/' element={<Navigate to='/login' />} /> */}

        <Route path='/*' element={<CouchRoutes />} />
      </Routes>
    </>
  );
};

export default AppRouter;
