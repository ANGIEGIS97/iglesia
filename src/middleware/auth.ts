import { auth_api } from "../lib/api";
import { storage } from "../lib/storage";

export const checkAuth = () => {
  if (typeof window === "undefined") return false;

  const token = storage.token.get();
  return !!auth_api.getCurrentUser() || !!token;
};

export const redirectIfNotAuthenticated = async () => {
  if (typeof window === "undefined") return;

  return new Promise((resolve) => {
    const unsubscribe = auth_api.onAuthStateChange((user) => {
      const token = storage.token.get();

      if (!user && !token) {
        window.location.href = "/";
      }

      unsubscribe();
      resolve(user);
    });
  });
};
