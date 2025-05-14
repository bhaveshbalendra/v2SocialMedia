// import Cookies from "js-cookie";
// import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import AppRoutes from "./routes/AppRoutes";
import { store } from "./store/store";
const App = () => {
  // useEffect(() => {
  //   const refreshToken = Cookies.get("refreshToken");

  //   if (!refreshToken) {
  //     localStorage.removeItem("accessToken");
  //   }
  // }, []);
  return (
    <Provider store={store}>
      <Toaster />
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
