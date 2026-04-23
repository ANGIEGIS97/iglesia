export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "El correo electrónico no es válido",
  "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
  "auth/user-not-found": "No existe una cuenta con este correo",
  "auth/wrong-password": "Contraseña incorrecta",
  "auth/too-many-requests": "Demasiados intentos. Intente más tarde",
  "auth/network-request-failed": "Error de conexión. Verifique su conexión a internet",
  "auth/invalid-credential": "Credenciales inválidas",
};

export function getFirebaseErrorMessage(
  err: unknown,
  fallback = "Error desconocido"
): string {
  if (err && typeof err === "object" && "code" in err) {
    return FIREBASE_ERROR_MESSAGES[(err as any).code] ?? fallback;
  }
  return fallback;
}
