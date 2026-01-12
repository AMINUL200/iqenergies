import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ---------- LOGIN / REGISTER (GUEST ONLY) ---------- */
export const GuestRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  /**
   * 🔑 IMPORTANT:
   * If user came here because of redirect (state.from),
   * allow login page even if authenticated
   */
  if (isAuthenticated && location.state?.from) {
    return <Outlet />;
  }

  // Normal behavior: logged-in users can't see login/register
  if (isAuthenticated) {
    return user?.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <Outlet />;
};

/* ---------- PUBLIC USER ROUTES ---------- */
/* Accessible to everyone EXCEPT admin */
export const PublicUserRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

/* ---------- PRIVATE USER ROUTES (LOGGED-IN USERS) ---------- */
export const PrivateUserRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
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

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
