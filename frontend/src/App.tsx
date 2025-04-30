import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import SignupPage from "./pages/SignupPage";
import { store } from "./store/store";
const AppRouter = () => {
  return (
    <Routes>
      {/* protected routes */}
      <Route path="/" element={<div>Home</div>} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/contact" element={<div>Contact</div>} />

      {/* public routes */}
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppRouter />
      </Router>
    </Provider>
  );
};

export default App;
