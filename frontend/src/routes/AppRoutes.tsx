import ContentSection from "@/components/contents/ContentSection";
import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import ChatPage from "@/pages/ChatPage";
import EditProfilePage from "@/pages/EditProfilePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingPage from "@/pages/SettingPage";
import SignupPage from "@/pages/SignupPage";
import { Route, Routes } from "react-router";
import { PATH } from "./pathConstants";
// import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={PATH.HOME} element={<MainLayout />}>
        <Route path={PATH.HOME} element={<ContentSection />} />
        <Route path={PATH.PROFILE} element={<ProfilePage />} />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path={PATH.LOGIN} element={<LoginPage />} />
        <Route path={PATH.SIGNUP} element={<SignupPage />} />

        <Route
          path={PATH.FORGET_PASSWORD}
          element={<h1>ForgotPasswordPage</h1>}
        />
        {/* <Route
          path="reset-password/:token"
          element={<h1>ResetPasswordPage</h1>}
          /> */}
        {/* <Route path="verify-otp" element={<h1>OTPVerificationPage</h1>} /> */}
      </Route>

      {/* Protected routes */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route element={<MainLayout />}>
        <Route path={PATH.PROFILE} element={<ProfilePage />} />
        <Route path={PATH.MESSAGES} element={<ChatPage />} />
        <Route path={PATH.EDIT_PROFILE} element={<EditProfilePage />} />
        <Route path={PATH.SETTINGS} element={<SettingPage />} />
      </Route>
      {/* </Route> */}

      {/* Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
