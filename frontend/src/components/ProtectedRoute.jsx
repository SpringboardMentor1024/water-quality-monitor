import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />;
  }

  // Token exists → render child routes
  return children;
}
