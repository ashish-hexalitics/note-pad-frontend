import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./routes/PrivateRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { privateRoutes, authRoutes } from "./routes/index";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          {authRoutes.map(({ path, component: Component }) => {
            return (
              <Route
                key={path}
                path={path}
                element={
                  <AuthRoutes>
                    <Component />
                  </AuthRoutes>
                }
              />
            );
          })}
          {privateRoutes.map(({ path, component: Component }) => {
            return (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoutes>
                    <Component />
                  </ProtectedRoutes>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
