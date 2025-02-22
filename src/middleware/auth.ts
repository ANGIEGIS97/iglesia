import { auth_api } from "../lib/api";

export const checkAuth = () => {
  if (typeof window === "undefined") return false;

  // Verificar tanto el usuario actual como el token
  const token = localStorage.getItem("token");
  return !!auth_api.getCurrentUser() || !!token;
};

export const redirectIfNotAuthenticated = async () => {
  if (typeof window === "undefined") return;

  // Esperar a que Firebase inicialice
  return new Promise((resolve) => {
    const unsubscribe = auth_api.onAuthStateChange((user) => {
      const token = localStorage.getItem("token");

      if (!user && !token) {
        window.location.href = "/";
      }

      unsubscribe();
      resolve(user);
    });
  });
};
