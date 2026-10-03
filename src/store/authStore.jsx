import { create } from "zustand";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuthStore } from "../admin/AdminAuthContext";

// Helper to read initial user from local storage
const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("addis-eats-user"));
  } catch {
    return null;
  }
};

// Zustand store for Authentication
export const useAuthStore = create((set) => ({
  // State
  user: readUser(),

  // Actions
  signIn: (name, email, password) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === "admin@gmail.com" && password === "admin123";

    const nextUser = {
      name: cleanName,
      email: cleanEmail,
      password,
      isAdmin,
    };

    localStorage.setItem("addis-eats-user", JSON.stringify(nextUser));
    
    // Sync with admin store
    if (isAdmin) {
      localStorage.setItem("addis-eats-admin", "true");
      useAdminAuthStore.setState({ admin: true });
    } else {
      localStorage.removeItem("addis-eats-admin");
      useAdminAuthStore.setState({ admin: false });
    }

    set({ user: nextUser });
    return isAdmin;
  },

  signOut: () => {
    localStorage.removeItem("addis-eats-user");
    localStorage.removeItem("addis-eats-admin");
    
    // Sync with admin store
    useAdminAuthStore.setState({ admin: false });
    
    set({ user: null });
  },
}));

export function RequireAuth({ children }) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  if (!user) {
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }
  return children;
}
