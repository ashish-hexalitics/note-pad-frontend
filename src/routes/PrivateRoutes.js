import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const auth_token = localStorage.getItem("access_token");
  return auth_token ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
