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

      <Route element={<ProtectedRoute />}> //acts as a wrapper for everything that require authentication
        <Route //protected route
          path="/garden"
          element={<TestDashboard />}
        />
      </Route> 
      <Route element={<ProtectedRoute />}>

        {/* We'll add these later */}
        {/* <Route path="/garden" element={<MyGardenPage />} /> */}
        {/* <Route path="/plants/log" element={<LogPlantPage />} /> */}

      </Route>

    </Routes>
  );
}
function TestDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold">
        Protected Dashboard
      </h1>
    </div>
  );
}

export default AppRoutes;