import {
  signInWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

export const checkAuth = () => {
  if (!auth.currentUser) {
    throw new Error(
      "No hay sesión activa. Por favor, inicia sesión nuevamente."
    );
  }
  return true;
};

export const auth_api = {
  login: async (credentials: { username: string; password: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.username,
        credentials.password
      );
      const token = await userCredential.user.getIdToken();
      return {
        data: {
          token,
          user: userCredential.user,
        },
      };
    } catch (error: any) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await auth.signOut();

      localStorage.removeItem("token");
      sessionStorage.clear();

      try {
        indexedDB.deleteDatabase("firebaseLocalStorageDb");
      } catch (e) {
        console.error("Error al limpiar IndexedDB:", e);
      }
    } catch (error: any) {
      throw new Error(
        `Error al cerrar sesión: ${error.message ?? "Error desconocido"}`
      );
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },

  onAuthStateChange: (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  changePassword: async (passwords: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const user = auth.currentUser;
    if (!user?.email) {
      throw new Error("Usuario no autenticado");
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwords.oldPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.newPassword);

      return {
        data: {
          mensaje: "Contraseña actualizada exitosamente",
        },
      };
    } catch (error: any) {
      throw new Error(
        `Error al cambiar la contraseña: ${
          error.message ?? "Error desconocido"
        }`
      );
    }
  },
};
