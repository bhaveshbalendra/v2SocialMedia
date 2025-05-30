// src/App.tsx
import { useEffect } from "react";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";
// import RouteSpinner from "./components/common/RouteSpinner";
import { ThemeProvider } from "./components/layouts/theme-provider";
import { useTokenPolling } from "./hooks/auth/useSyncAuthCredentials";
import { routesConfig } from "./routes/AppRoutes";
import { store } from "./store/store";

// Create the data router
const router = createBrowserRouter(routesConfig);

// Create a wrapper component to use hooks inside Redux Provider
const AppContent = () => {
  // Use polling to refresh the token every 6 hours
  // const navigation = useNavigation();
  useTokenPolling();

  return (
    <ThemeProvider>
      {/* {navigation.state === "loading" && <RouteSpinner />} */}
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

const App = () => {
  useEffect(() => {
    // Remove the initial HTML spinner
    const spinner = document.getElementById("spinner-root");
    if (spinner) spinner.remove();
  }, []);

  return (
    <Provider store={store}>
      <Toaster />
      <AppContent />
    </Provider>
  );
};

export default App;
