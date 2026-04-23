import {
  collection,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { checkAuth } from "./auth";

export interface UserProfile {
  displayName: string;
  email: string;
  updatedAt: Date;
  userXp?: number;
  userLevel?: number;
  userRank?: number;
  achievements?: any[];
  loginStreak?: number;
  streaks?: {
    anuncios: {
      current: number;
      lastActivity: string | null;
      weeklyGoalMet: boolean;
      lastWeekStart: string | null;
    };
    fechas: {
      current: number;
      lastActivity: string | null;
      weeklyGoalMet: boolean;
      lastWeekStart: string | null;
    };
  };
}

export interface UserWithId extends UserProfile {
  id: string;
}

export const usuarios = {
  getAll: async (): Promise<UserWithId[]> => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName ?? "",
        email: doc.data().email ?? "",
        updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
      }));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw new Error("No se pudieron cargar los usuarios");
    }
  },

  getById: async (userId: string): Promise<{ data: UserProfile }> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          data: {
            displayName:
              data.displayName ?? auth.currentUser?.displayName ?? "",
            email: data.email ?? auth.currentUser?.email ?? "",
            updatedAt: data.updatedAt?.toDate() ?? new Date(),
          },
        };
      }
      return {
        data: {
          displayName: auth.currentUser?.displayName ?? "",
          email: auth.currentUser?.email ?? "",
          updatedAt: new Date(),
        },
      };
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      throw new Error("No se pudo cargar el perfil del usuario");
    }
  },

  subscribeToProfile: (
    userId: string,
    callback: (profile: UserProfile) => void
  ): (() => void) => {
    return onSnapshot(
      doc(db, "users", userId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          callback({
            displayName:
              data.displayName ?? auth.currentUser?.displayName ?? "",
            email: data.email ?? auth.currentUser?.email ?? "",
            updatedAt: data.updatedAt?.toDate() ?? new Date(),
          });
        } else {
          callback({
            displayName: auth.currentUser?.displayName ?? "",
            email: auth.currentUser?.email ?? "",
            updatedAt: new Date(),
          });
        }
      },
      (error) => {
        console.error("Error al escuchar cambios del perfil:", error);
        throw new Error("Error en la suscripción a cambios del perfil");
      }
    );
  },

  update: async (userId: string, data: Partial<UserProfile>): Promise<void> => {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, data, { merge: true });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw new Error("No se pudo actualizar el perfil del usuario");
    }
  },

  getRanking: async (): Promise<UserWithId[]> => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            displayName: data.displayName ?? "",
            email: data.email ?? "",
            userXp: data.userXp ?? 0,
            userLevel: data.userLevel ?? 1,
            userRank: data.userRank ?? 1,
            achievements: data.achievements ?? [],
            loginStreak: data.loginStreak ?? 0,
            updatedAt: data.updatedAt?.toDate() ?? new Date(),
          };
        })
        .sort((a, b) => {
          if (b.userRank !== a.userRank) {
            return b.userRank - a.userRank;
          }
          if (b.userLevel !== a.userLevel) {
            return b.userLevel - a.userLevel;
          }
          return b.userXp - a.userXp;
        });
    } catch (error) {
      console.error("Error al obtener ranking de usuarios:", error);
      throw new Error("No se pudo cargar el ranking");
    }
  },

  updateGameState: async (
    userId: string,
    gameState: {
      userXp: number;
      userLevel: number;
      userRank: number;
      loginStreak: number;
      achievements: any[];
      streaks?: {
        anuncios: {
          current: number;
          lastActivity: string | null;
          weeklyGoalMet: boolean;
          lastWeekStart: string | null;
        };
        fechas: {
          current: number;
          lastActivity: string | null;
          weeklyGoalMet: boolean;
          lastWeekStart: string | null;
        };
      };
    }
  ): Promise<void> => {
    try {
      checkAuth();
      const userDocRef = doc(db, "users", userId);
      const updateData: any = {
        userXp: gameState.userXp,
        userLevel: gameState.userLevel,
        userRank: gameState.userRank,
        loginStreak: gameState.loginStreak,
        achievements: gameState.achievements,
        updatedAt: serverTimestamp(),
      };

      if (gameState.streaks) {
        updateData.streaks = gameState.streaks;
      }

      await setDoc(userDocRef, updateData, { merge: true });
    } catch (error) {
      console.error("Error al actualizar estado de gamificación:", error);
      throw new Error("No se pudo actualizar el estado de gamificación");
    }
  },

  getGameState: async (
    userId: string
  ): Promise<{
    userXp: number;
    userLevel: number;
    userRank: number;
    loginStreak: number;
    achievements: any[];
    streaks?: {
      anuncios: {
        current: number;
        lastActivity: string | null;
        weeklyGoalMet: boolean;
        lastWeekStart: string | null;
      };
      fechas: {
        current: number;
        lastActivity: string | null;
        weeklyGoalMet: boolean;
        lastWeekStart: string | null;
      };
    };
  } | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const gameState: any = {
          userXp: data.userXp ?? 0,
          userLevel: data.userLevel ?? 1,
          userRank: data.userRank ?? 1,
          loginStreak: data.loginStreak ?? 0,
          achievements: data.achievements ?? [],
        };

        if (data.streaks) {
          gameState.streaks = data.streaks;
        }

        return gameState;
      }
      return null;
    } catch (error) {
      console.error("Error al cargar datos de gamificación:", error);
      return null;
    }
  },
};
