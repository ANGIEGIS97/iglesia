import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { checkAuth } from "./auth";

export interface Fecha {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  banner?: string;
  infoIconoTexto?: string;
  infoAdiccional?: string;
  eventoId?: string;
  createdBy: string;
  updatedBy?: string;
}

export const fechas = {
  /** Solo las fechas, sin resolver nombres de usuario (rápido, sin N+1). */
  getAll: async () => {
    try {
      const fechasRef = collection(db, "fechas");
      const q = query(fechasRef, orderBy("fecha", "asc"));
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    } catch (error) {
      console.error("Error al obtener fechas:", error);
      throw new Error("Error al cargar las fechas");
    }
  },

  /** Fechas con nombres de usuario resueltos. Usa solo cuando necesitas mostrar quién creó/modificó. */
  getAllWithUserNames: async () => {
    try {
      const fechasRef = collection(db, "fechas");
      const q = query(fechasRef, orderBy("fecha", "asc"));
      const snapshot = await getDocs(q);

      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const users = new Map<string, string>();
      usersSnapshot.docs.forEach((doc) => {
        users.set(doc.id, doc.data().displayName ?? doc.data().email);
      });

      return {
        data: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdBy: users.get(doc.data().createdBy) ?? "Desconocido",
          updatedBy: doc.data().updatedBy
            ? users.get(doc.data().updatedBy) ?? "Desconocido"
            : undefined,
        })),
      };
    } catch (error) {
      console.error("Error al obtener fechas:", error);
      throw new Error("Error al cargar las fechas");
    }
  },

  getById: async (id: string) => {
    try {
      const docRef = doc(db, "fechas", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          data: {
            id: docSnap.id,
            ...docSnap.data(),
          },
        };
      }
      throw new Error("Fecha no encontrada");
    } catch (error: any) {
      console.error("Error al obtener fecha:", error);
      throw new Error("Error al obtener la fecha: " + error.message);
    }
  },

  create: async (data: any) => {
    try {
      checkAuth();
      const fechaData = {
        ...data,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      };

      const fechasRef = collection(db, "fechas");
      const docRef = await addDoc(fechasRef, fechaData);

      return {
        data: {
          id: docRef.id,
          ...fechaData,
        },
      };
    } catch (error) {
      console.error("Error al crear fecha:", error);
      throw new Error("Error al crear la fecha");
    }
  },

  update: async (id: string, data: any) => {
    try {
      checkAuth();
      const docRef = doc(db, "fechas", id);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Fecha no encontrada");
      }

      const currentData = docSnap.data();
      const fechaData = {
        ...currentData,
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
        createdBy: currentData.createdBy,
      };

      await updateDoc(docRef, fechaData);

      return {
        data: {
          id,
          ...fechaData,
        },
      };
    } catch (error) {
      console.error("Error al actualizar fecha:", error);
      throw new Error("Error al actualizar la fecha");
    }
  },

  delete: async (id: string) => {
    try {
      checkAuth();
      await deleteDoc(doc(db, "fechas", id));
      return {
        data: { id },
        mensaje: "Fecha eliminada exitosamente",
      };
    } catch (error) {
      console.error("Error al eliminar fecha:", error);
      throw new Error("Error al eliminar la fecha");
    }
  },
};
