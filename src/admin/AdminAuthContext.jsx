import { create } from "zustand";
import { Navigate, useLocation } from "react-router-dom";

const getInitialAdmin = () => {
  try {
    return localStorage.getItem("addis-eats-admin") === "true";
  } catch {
    return false;
  }
};

export const useAdminAuthStore = create(() => ({
  admin: getInitialAdmin(),
  signIn: (email, password) => {
    if (email !== "admin@gmail.com" || password !== "admin123") return false;

    localStorage.setItem("addis-eats-admin", "true");
    useAdminAuthStore.setState({ admin: true });
    return true;
  },
  signOut: () => {
    localStorage.removeItem("addis-eats-admin");
    useAdminAuthStore.setState({ admin: false });
  },
}));

export function AdminAuthProvider({ children }) {
  return children;
}

export function useAdminAuth() {
  return useAdminAuthStore();
}

export function RequireAdmin({ children }) {
  const { admin } = useAdminAuth();
  const location = useLocation();

  if (!admin) {
    return (
      <Navigate
        to={`/admin/login?returnTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}
