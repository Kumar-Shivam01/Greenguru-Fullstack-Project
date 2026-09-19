import { Routes, Route } from "react-router-dom";
import MyGardenPage from "../pages/MyGardenPage";
import LogPlantPage from "../pages/LogPlantPage";
import ProfilePage from "../pages/ProfilePage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../routes/protectedRoutes";
import DashboardLayout from "../components/layout/DashboardLayout";
import PlantInfoPage from './../pages/PlantInfoPage'
import PlantPreviewPage from "../pages/PlantPreviewPage";
import AccountPage from './../pages/AccountPage'
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

function AppRoutes() {
  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/send-reset-otp" element={<ForgotPasswordPage />} />

      {/* Protected routes wrapped with authentication and layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/garden" element={<MyGardenPage />} />
            <Route path="/plants/:id" element={<PlantInfoPage />} />
            <Route path="/plants/new" element={<LogPlantPage />}/>
            <Route path="/plants/new/preview" element={<PlantPreviewPage />}/>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
        </Route> 

    </Routes>
  );
}

export default AppRoutes;
