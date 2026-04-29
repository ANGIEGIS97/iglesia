export interface SavedAccount {
  username: string;
  password: string;
  displayName?: string;
  email?: string;
}

export interface SaveAccountInput {
  uid: string;
  username: string;
  password: string;
  displayName?: string;
  email?: string;
}

const PREFIX = {
  user: "rememberUser_",
  password: "rememberPassword_",
  displayName: "displayName_",
  email: "email_",
} as const;

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`accountsStorage: error al limpiar ${key}`, e);
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(`accountsStorage: error al guardar ${key}`, e);
  }
}

export const accountsStorage = {
  list(): SavedAccount[] {
    const accounts: SavedAccount[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(PREFIX.user)) continue;
        const username = localStorage.getItem(key);
        if (!username) continue;
        const password = localStorage.getItem(PREFIX.password + username);
        if (!password) continue;
        accounts.push({
          username,
          password,
          displayName:
            localStorage.getItem(PREFIX.displayName + username) || undefined,
          email: localStorage.getItem(PREFIX.email + username) || username,
        });
      }
    } catch (e) {
      console.error("accountsStorage.list: error al leer cuentas guardadas", e);
    }
    return accounts;
  },

  hasAny(): boolean {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX.user)) return true;
      }
    } catch (e) {
      console.error("accountsStorage.hasAny: error", e);
    }
    return false;
  },

  save(input: SaveAccountInput): void {
    safeSet(PREFIX.user + input.uid, input.username);
    safeSet(PREFIX.password + input.username, input.password);
    if (input.displayName) {
      safeSet(PREFIX.displayName + input.username, input.displayName);
    }
    if (input.email) {
      safeSet(PREFIX.email + input.username, input.email);
    }
  },

  updateProfile(username: string, displayName?: string, email?: string): void {
    if (displayName) safeSet(PREFIX.displayName + username, displayName);
    if (email) safeSet(PREFIX.email + username, email);
  },

  remove(username: string): void {
    try {
      // Eliminar todas las claves rememberUser_* cuyo valor sea este username
      const userKeysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith(PREFIX.user) &&
          localStorage.getItem(key) === username
        ) {
          userKeysToRemove.push(key);
        }
      }
      userKeysToRemove.forEach(safeRemove);
    } catch (e) {
      console.error("accountsStorage.remove: error al iterar localStorage", e);
    }

    safeRemove(PREFIX.password + username);
    safeRemove(PREFIX.displayName + username);
    safeRemove(PREFIX.email + username);
  },

  getDisplayName(username: string): string | null {
    return localStorage.getItem(PREFIX.displayName + username);
  },
};
