import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const auth_token = localStorage.getItem("access_token");
  const navigateRoute = `/user/notes`
  return !auth_token ? children : <Navigate to={navigateRoute} />;
};

export default PublicRoutes;
