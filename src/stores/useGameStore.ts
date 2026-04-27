import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { publish } from "../lib/eventBus";

export const GAME_AWARD_XP_EVENT = "game:awardXp";

export const useGameStore = defineStore("game", () => {
  const userXp = ref(0);
  const userLevel = ref(1);
  const userRank = ref(1);
  const loginStreak = ref(0);
  const rankNames = ["Bronce", "Plata", "Oro", "Diamante", "Platino"];

  const xpForNextLevel = computed(() => userLevel.value * 100);
  const xpPercentage = computed(() =>
    Math.min(100, Math.floor((userXp.value / xpForNextLevel.value) * 100))
  );

  // Copia exacta de la lógica de awardXp de AdminSidebar.
  // Retorna flags para que el componente maneje las animaciones y llame a logrosRef.
  function awardXp(amount: number): { leveledUp: boolean; rankedUp: boolean } {
    userXp.value += amount;
    let leveledUp = false;
    let rankedUp = false;

    if (userXp.value >= xpForNextLevel.value) {
      userXp.value -= xpForNextLevel.value;
      userLevel.value++;
      leveledUp = true;

      if (userLevel.value > 10) {
        userLevel.value = 1;
        userRank.value++;
        rankedUp = true;
      }
    }

    return { leveledUp, rankedUp };
  }

  function setFromSaved(state: {
    userXp?: number;
    userLevel?: number;
    userRank?: number;
    loginStreak?: number;
  }) {
    userXp.value = state.userXp ?? 0;
    userLevel.value = state.userLevel ?? 1;
    userRank.value = state.userRank ?? 1;
    loginStreak.value = state.loginStreak ?? 0;
  }

  // Puente cross-island: las páginas admin (AdminEventList, AdminFechasList)
  // viven en islands de Astro distintos al MenuInicio/AdminSidebar y por tanto
  // tienen su propia instancia de Pinia. Mutar `userXp` localmente no se refleja
  // en el sidebar. Esta acción publica un evento global; el sidebar (único dueño
  // de la UI de XP y de la persistencia en Firestore) lo recibe y aplica el XP
  // sobre su propia instancia del store.
  function requestXp(amount: number) {
    publish<number>(GAME_AWARD_XP_EVENT, amount);
  }

  return {
    userXp, userLevel, userRank, loginStreak, rankNames,
    xpForNextLevel, xpPercentage,
    awardXp, requestXp, setFromSaved,
  };
});
