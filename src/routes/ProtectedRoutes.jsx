import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ---------- Login / Register ---------- */
export const GuestRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Outlet />;

  // logged-in users cannot see login/register
  return user?.role === "admin" ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/" replace />
  );
};

/* ---------- PUBLIC USER ROUTES ---------- */
/* Anyone can access (logged-in or not), but admin is blocked */
export const PublicUserRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

/* ---------- PRIVATE USER ROUTES ---------- */
export const PrivateUserRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "user") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

/* ---------- ADMIN ROUTES ---------- */
export const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // ⛔ wait

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
