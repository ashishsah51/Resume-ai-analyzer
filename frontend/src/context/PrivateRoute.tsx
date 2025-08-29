// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // user comes from AuthContext

  if (!user) {
    // If not logged in, redirect to /auth
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
