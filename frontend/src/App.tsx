import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { Toaster } from "sonner";
import AppLayout from "./components/layout/AppLayout";
import { ThemeProvider } from "./components/ui/theme-provider";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import SignupPage from "./pages/SignupPage";
import { store } from "./store/store";

const AppRouter = () => {
  return (
    <Routes>
      {/* Main layout route */}
      <Route path="/" element={<AppLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="settings/:username" element={<SettingPage />} />
        </Route>

        {/* Public auth routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<h1>ForgotPasswordPage</h1>} />
        <Route
          path="reset-password/:token"
          element={<h1>ResetPasswordPage</h1>}
        />
        <Route path="verify-otp" element={<h1>OTPVerificationPage</h1>} />
      </Route>

      {/* Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Toaster />
      <ThemeProvider>
        <Router>
          <AppRouter />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
