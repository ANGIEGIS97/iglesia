<script setup lang="ts">
import { ref, onMounted } from "vue";

interface SavedAccount {
  username: string;
  password: string;
  displayName?: string;
  email?: string;
  index?: number;
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "select-account", "use-another"]);
const savedAccounts = ref<SavedAccount[]>([]);

// Función para obtener la inicial del nombre de usuario
const getUserInitial = (username: string) => {
  // Si hay un displayName guardado, usar ese
  const displayName = localStorage.getItem(`displayName_${username}`);
  if (displayName) {
    return displayName.charAt(0).toUpperCase();
  }
  // Si no, usar la primera letra del correo
  return username ? username.charAt(0).toUpperCase() : "U";
};

// Función para generar un color basado en el nombre de usuario
const getUserColor = (username: string) => {
  const colors = [
    "#2196F3", // Azul
    "#4CAF50", // Verde
    "#F44336", // Rojo
    "#9C27B0", // Púrpura
    "#FF9800", // Naranja
    "#009688", // Verde azulado
    "#E91E63", // Rosa
    "#673AB7", // Violeta
  ];

  if (!username) return colors[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Función para obtener el nombre a mostrar
const getDisplayName = (username: string) => {
  const displayName = localStorage.getItem(`displayName_${username}`);
  if (displayName) {
    return displayName;
  }
  // Si no hay displayName, mostrar la parte del correo antes del @
  return username.split('@')[0];
};

const selectAccount = (account: SavedAccount) => {
  emit("select-account", account);
};

const useAnotherAccount = () => {
  emit("use-another");
};

// Función para eliminar una cuenta guardada
const removeAccount = (event: Event, account: SavedAccount) => {
  // Detener la propagación para evitar que se seleccione la cuenta
  event.stopPropagation();
  
  try {
    // Eliminar la cuenta del localStorage
    const userKeys = Object.keys(localStorage).filter(key => 
      key.startsWith("rememberUser_") && 
      localStorage.getItem(key) === account.username
    );
    
    // Eliminar la clave de usuario
    userKeys.forEach(key => localStorage.removeItem(key));
    
    // Eliminar la contraseña asociada
    localStorage.removeItem(`rememberPassword_${account.username}`);
    
    // Eliminar el nombre para mostrar si existe
    localStorage.removeItem(`displayName_${account.username}`);
    
    // Eliminar el email si existe
    localStorage.removeItem(`email_${account.username}`);
    
    // Actualizar la lista de cuentas
    savedAccounts.value = savedAccounts.value.filter(
      acc => acc.username !== account.username
    );
    
    // Si no quedan cuentas, cerrar el selector y abrir el formulario de login
    if (savedAccounts.value.length === 0) {
      useAnotherAccount();
    }
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
  }
};

onMounted(() => {
  // Cargar cuentas guardadas
  try {
    // Buscar todas las cuentas guardadas en localStorage
    const accounts: SavedAccount[] = [];
    
    // Buscar todas las claves que empiezan con "rememberUser_"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("rememberUser_")) {
        const username = localStorage.getItem(key);
        if (username) {
          const passwordKey = `rememberPassword_${username}`;
          const password = localStorage.getItem(passwordKey);
          if (password) {
            accounts.push({
              username,
              password,
              displayName: localStorage.getItem(`displayName_${username}`) || undefined,
              email: localStorage.getItem(`email_${username}`) || username
            });
          }
        }
      }
    }
    
    // Asignar índices para la animación escalonada
    accounts.forEach((account, index) => {
      account.index = index;
    });
    
    savedAccounts.value = accounts;
  } catch (error) {
    console.error("Error al cargar cuentas guardadas:", error);
  }
});
</script>

<template>
  <!-- Overlay del modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
  >
    <!-- Modal -->
    <div
      class="relative bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full m-4 border border-white/20 animate-fadeIn"
    >
      <!-- Header con título y botón de cerrar -->
      <div
        class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
          Selecciona una cuenta
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <!-- Lista de cuentas guardadas -->
        <div class="space-y-3 mb-6">
          <div 
            v-for="account in savedAccounts" 
            :key="account.username"
            class="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors account-item group"
            :style="{ '--index': account.index }"
          >
            <div
              @click="selectAccount(account)"
              class="flex-1 flex items-center"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3"
                :style="{ backgroundColor: getUserColor(account.displayName || account.username) }"
              >
                {{ getUserInitial(account.username) }}
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ getDisplayName(account.username) }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ account.email || account.username }}
                </p>
              </div>
            </div>
            
            <!-- Botón para eliminar cuenta -->
            <button
              @click="(event) => removeAccount(event, account)"
              class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              title="Eliminar cuenta"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Botón para usar otra cuenta -->
        <button
          @click="useAnotherAccount"
          class="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Usar otra cuenta
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones para el selector de cuentas */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s both;
}

/* Animación para los elementos de la lista */
.account-item {
  animation: fadeIn 0.3s both;
  animation-delay: calc(var(--index, 0) * 0.05s);
  position: relative;
}

/* Transición suave para el botón de eliminar */
.account-item button {
  transition: opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

/* Efecto de eliminación */
@keyframes removeItem {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.removing {
  animation: removeItem 0.3s forwards;
}
</style> 