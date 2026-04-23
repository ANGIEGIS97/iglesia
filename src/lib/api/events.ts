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

export interface EventoAPI {
  id: string;
  titulo?: string;
  descripcion?: string;
  eslogan?: string;
  linkBoton?: string;
  image?: string;
  fecha?: string;
  favorito?: boolean;
  visible?: boolean;
  order?: number;
  createdAt?: any;
  createdBy?: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface Evento
  extends Required<Pick<EventoAPI, "id" | "titulo" | "descripcion">> {
  eslogan?: string;
  linkBoton?: string;
  image?: string;
  fecha?: string;
  favorito?: boolean;
  visible?: boolean;
  order?: number;
  createdAt?: any;
  createdBy?: string;
  updatedAt?: any;
  updatedBy?: string;
}

export const eventos = {
  getAll: async () => {
    try {
      const eventosRef = collection(db, "eventos");
      const q = query(eventosRef, orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    } catch (error: any) {
      console.error("Error al obtener eventos:", error);
      throw new Error("Error al cargar los eventos: " + error.message);
    }
  },

  getById: async (id: string) => {
    try {
      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          data: {
            id: docSnap.id,
            ...docSnap.data(),
          },
        };
      }
      throw new Error("Evento no encontrado");
    } catch (error: any) {
      console.error("Error al obtener evento:", error);
      throw new Error("Error al obtener el evento: " + error.message);
    }
  },

  create: async (data: any) => {
    try {
      checkAuth();

      const eventosRef = collection(db, "eventos");
      const snapshot = await getDocs(eventosRef);

      const updatePromises = snapshot.docs.map(async (docSnapshot) => {
        const currentOrder = docSnapshot.data().order ?? 0;
        const docRef = doc(db, "eventos", docSnapshot.id);
        await updateDoc(docRef, { order: currentOrder + 1 });
      });

      await Promise.all(updatePromises);

      const eventData = {
        titulo: data.titulo?.trim() ?? "",
        descripcion: data.descripcion?.trim() ?? "",
        eslogan: data.eslogan?.trim() ?? "",
        linkBoton: data.linkBoton?.trim() ?? "",
        image: data.image ?? "",
        fecha: data.fecha ?? new Date().toISOString(),
        favorito: data.favorito ?? false,
        visible: data.visible ?? true,
        order: 0,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      };

      const docRef = await addDoc(eventosRef, eventData);

      return {
        data: {
          id: docRef.id,
          ...eventData,
        },
      };
    } catch (error: any) {
      console.error("Error al crear evento:", error);
      throw new Error(error.message ?? "Error al crear el evento");
    }
  },

  setFavorito: async (id: string, favorito: boolean) => {
    try {
      checkAuth();
      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("El evento no existe");
      }
      await updateDoc(docRef, {
        favorito,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
      });
      return {
        data: { id, favorito },
      };
    } catch (error: any) {
      console.error("Error al actualizar favorito:", error);
      throw new Error(error.message ?? "Error al actualizar favorito");
    }
  },

  setVisible: async (id: string, visible: boolean) => {
    try {
      checkAuth();
      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("El evento no existe");
      }
      await updateDoc(docRef, {
        visible,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
      });
      return {
        data: { id, visible },
      };
    } catch (error: any) {
      console.error("Error al actualizar visibilidad:", error);
      throw new Error(error.message ?? "Error al actualizar visibilidad");
    }
  },

  update: async (id: string, data: any) => {
    try {
      checkAuth();

      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("El evento no existe");
      }

      const updateData = {
        titulo: data.titulo?.trim() ?? "",
        descripcion: data.descripcion?.trim() ?? "",
        eslogan: data.eslogan?.trim() ?? "",
        linkBoton: data.linkBoton?.trim() ?? "",
        image: data.image ?? "",
        fecha: data.fecha ?? new Date().toISOString(),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
      };

      await updateDoc(docRef, updateData);

      return {
        data: {
          id,
          ...updateData,
        },
      };
    } catch (error: any) {
      console.error("Error al actualizar evento:", error);
      throw new Error(error.message ?? "Error al actualizar el evento");
    }
  },

  delete: async (id: string) => {
    try {
      checkAuth();

      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("El evento no existe");
      }

      await deleteDoc(docRef);

      return {
        data: { id },
        mensaje: "Evento eliminado exitosamente",
      };
    } catch (error: any) {
      console.error("Error al eliminar evento:", error);
      throw new Error(error.message ?? "Error al eliminar el evento");
    }
  },

  updateOrder: async (id: string, order: number) => {
    try {
      checkAuth();
      const docRef = doc(db, "eventos", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("El evento no existe");
      }
      await updateDoc(docRef, {
        order,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
      });
      return {
        data: { id, order },
      };
    } catch (error: any) {
      console.error("Error al actualizar orden:", error);
      throw new Error(error.message ?? "Error al actualizar orden");
    }
  },
};
