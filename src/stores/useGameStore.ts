import { defineStore } from "pinia";
import { ref, computed } from "vue";

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

  return {
    userXp, userLevel, userRank, loginStreak, rankNames,
    xpForNextLevel, xpPercentage,
    awardXp, setFromSaved,
  };
});
