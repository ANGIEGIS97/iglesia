import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnCG79O4QorOhTkvgSwIXtT2zV4yimCUw",
  authDomain: "iglesia-87cd3.firebaseapp.com",
  projectId: "iglesia-87cd3",
  storageBucket: "iglesia-87cd3.firebasestorage.app",
  messagingSenderId: "366923103958",
  appId: "1:366923103958:web:ef0d86dec0dd88f4359377",
};

// Inicializar Firebase solo en el cliente
const { auth, db } =
  typeof window !== "undefined"
    ? (() => {
        const app = initializeApp(firebaseConfig);
        return {
          auth: getAuth(app),
          db: getFirestore(app),
        };
      })()
    : { auth: null, db: null };

export { auth, db };
