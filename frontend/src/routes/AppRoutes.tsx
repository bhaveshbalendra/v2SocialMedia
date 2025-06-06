import ContentSection from "@/components/contents/ContentSection";
import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import BookmarksPage from "@/pages/BookmarksPage";
import ChatPage from "@/pages/ChatPage";
import EditProfilePage from "@/pages/EditProfilePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingPage from "@/pages/SettingPage";
import SignupPage from "@/pages/SignupPage";
import { PATH } from "./pathConstants";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Define routes in createBrowserRouter format
export const routesConfig = [
  {
    // Public home route
    path: PATH.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ContentSection />,
      },
    ],
  },
  {
    // Auth routes - protected from authenticated users
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: PATH.LOGIN,
            element: <LoginPage />,
          },
          {
            path: PATH.SIGNUP,
            element: <SignupPage />,
          },
          {
            path: PATH.FORGET_PASSWORD,
            element: <h1>ForgotPasswordPage</h1>,
          },
        ],
      },
    ],
  },
  {
    // Protected routes
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: PATH.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: PATH.MESSAGES,
            element: <ChatPage />,
          },
          {
            path: PATH.EDIT_PROFILE,
            element: <EditProfilePage />,
          },
          {
            path: PATH.SETTINGS,
            element: <SettingPage />,
          },
          {
            path: PATH.BOOKMARKS,
            element: <BookmarksPage />,
          },
        ],
      },
    ],
  },
  {
    // Not Found route
    path: "*",
    element: <NotFoundPage />,
  },
];

// Legacy component for backward compatibility
// import { Route, Routes } from "react-router";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path={PATH.HOME} element={<MainLayout />}>
//         <Route path={PATH.HOME} element={<ContentSection />} />
//       </Route>

//       {/* Auth routes */}
//       <Route element={<AuthLayout />}>
//         <Route path={PATH.LOGIN} element={<LoginPage />} />
//         <Route path={PATH.SIGNUP} element={<SignupPage />} />

//         <Route
//           path={PATH.FORGET_PASSWORD}
//           element={<h1>ForgotPasswordPage</h1>}
//         />
//       </Route>

//       {/* Protected routes - uses ProtectedRoute to ensure authentication */}
//       <Route element={<ProtectedRoute />}>
//         <Route element={<MainLayout />}>
//           <Route path={PATH.PROFILE} element={<ProfilePage />} />
//           <Route path={PATH.MESSAGES} element={<ChatPage />} />
//           <Route path={PATH.EDIT_PROFILE} element={<EditProfilePage />} />
//           <Route path={PATH.SETTINGS} element={<SettingPage />} />
//         </Route>
//       </Route>

//       {/* Not Found Page */}
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// };

// export default AppRoutes;
