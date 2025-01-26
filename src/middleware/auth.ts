import { jwtDecode } from "jwt-decode";

export const checkAuth = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};

export const redirectIfNotAuthenticated = () => {
  if (typeof window !== "undefined" && !checkAuth()) {
    window.location.href = "/login";
  }
};
