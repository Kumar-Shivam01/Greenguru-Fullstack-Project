import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../routes/protectedRoutes";

function AppRoutes() {
  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>

        {/* We'll add these later */}
        {/* <Route path="/garden" element={<MyGardenPage />} /> */}
        {/* <Route path="/plants/log" element={<LogPlantPage />} /> */}

      </Route>

    </Routes>
  );
}

export default AppRoutes;