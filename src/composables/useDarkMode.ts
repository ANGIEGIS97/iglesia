import { ref } from "vue";
import { storage } from "../lib/storage";

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function useDarkMode() {
  const stored = typeof window !== "undefined" ? storage.darkMode.get() : null;
  const isDark = ref(stored !== null ? stored : prefersDark());

  function toggle() {
    isDark.value = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark");
    storage.darkMode.set(isDark.value);
  }

  function load() {
    const s = storage.darkMode.get();
    isDark.value = s !== null ? s : prefersDark();
    document.documentElement.classList.toggle("dark", isDark.value);
  }

  return { isDark, toggle, load };
}
