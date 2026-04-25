# Plan de Migración a Tailwind CSS v4

## Estado actual del proyecto

- **Tailwind:** `tailwindcss@^3.4.6`
- **Integración Astro:** `@astrojs/tailwind@^5.1.0`
- **Astro:** `^4.11.5`
- **Configuraciones presentes:**
  - [tailwind.config.js](tailwind.config.js) — CommonJS, parece archivo antiguo/duplicado (`content` apunta a `./index.html`).
  - [tailwind.config.mjs](tailwind.config.mjs) — ESM, archivo activo (incluye keyframes `gradient`).
- **Uso de `@apply`:** sí, en bloques `<style>` de varios componentes Vue:
  - [src/components/SobreNosotros.vue](src/components/SobreNosotros.vue)
  - [src/components/panel/AdminEventList.vue](src/components/panel/AdminEventList.vue)
  - [src/components/panel/modals/EventoModal.vue](src/components/panel/modals/EventoModal.vue)
  - [src/components/Anuncios/CarruselAnuncios.vue](src/components/Anuncios/CarruselAnuncios.vue)
- **CSS de entrada:** no existe `src/**/*.css`. Tailwind se inyecta vía `@astrojs/tailwind` (modo `applyBaseStyles` por defecto).
- **Modo oscuro:** `darkMode: "class"` con toggle manual en [src/layouts/Layout.astro](src/layouts/Layout.astro).

---

## Objetivo

Migrar a la última versión estable de **Tailwind CSS v4.x**, reemplazando la integración `@astrojs/tailwind` por el plugin oficial recomendado `@tailwindcss/vite`, y trasladando la configuración de JS a CSS (`@theme`).

---

## Cambios principales que introduce v4

| Área | v3 (actual) | v4 (objetivo) |
|---|---|---|
| Motor | PostCSS + JIT | Oxide (Rust), CSS-first |
| Configuración | `tailwind.config.{js,mjs}` | `@theme { ... }` en CSS (JS opcional vía `@config`) |
| Importación CSS | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| Integración Astro | `@astrojs/tailwind` | `@tailwindcss/vite` (Vite plugin) |
| `darkMode: "class"` | Opción del config | `@custom-variant dark (&:where(.dark, .dark *));` |
| Navegadores soportados | Modernos + algunos legacy | Safari 16.4+, Chrome 111+, Firefox 128+ |
| Utilidades renombradas | `shadow-sm`, `blur-sm`, `rounded-sm`, `outline-none`, `ring` (3px) | `shadow-xs`, `blur-xs`, `rounded-xs`, `outline-hidden`, `ring-3` |
| Espacios opacos | `bg-opacity-50` | `bg-black/50` (sintaxis slash) |
| Bordes por defecto | `border-gray-200` implícito | Color `currentColor` (hay que añadir color explícito) |

---

## Pasos de migración

### Paso 0 — Verificación previa

- [ ] Confirmar que `node >= 20` está instalado (`node -v`).
- [ ] Crear rama de trabajo: `git checkout -b chore/tailwind-v4`.
- [ ] Asegurarse de que el árbol de trabajo está limpio salvo los cambios actuales (commit o stash previo).
- [ ] Ejecutar `npm run build` y `npm test` para tener una baseline verde.

### Paso 1 — Ejecutar el codemod oficial (opcional pero recomendado)

Tailwind ofrece un upgrader automático que migra utilidades renombradas y la sintaxis del config:

```bash
npx @tailwindcss/upgrade@latest
```

- Revisar el diff que produce — toca archivos `.vue`, `.astro`, configuración y CSS.
- No commitear todavía: el codemod no entiende todas las particularidades de Astro, así que conviene revisar manualmente.

### Paso 2 — Limpiar configuraciones duplicadas

- [ ] Eliminar [tailwind.config.js](tailwind.config.js) (es el archivo viejo CommonJS con `content: ["./index.html", ...]` que no aplica a Astro). Confirmar antes con `git log -- tailwind.config.js` para saber si todavía se referencia.
- [ ] Mantener temporalmente [tailwind.config.mjs](tailwind.config.mjs) para portar contenido al nuevo CSS en el Paso 4.

### Paso 3 — Actualizar dependencias

Quitar las viejas, añadir las nuevas:

```bash
npm uninstall @astrojs/tailwind tailwindcss
npm install tailwindcss@latest @tailwindcss/vite@latest
```

Verificar `package.json`:
- Quitar: `"@astrojs/tailwind"`, `"tailwindcss": "^3.4.6"`.
- Añadir: `"tailwindcss": "^4.x"`, `"@tailwindcss/vite": "^4.x"`.

### Paso 4 — Reemplazar la integración en `astro.config.mjs`

Archivo objetivo [astro.config.mjs](astro.config.mjs):

```js
import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [vue({ appEntrypoint: "/src/pinia" })],
});
```

### Paso 5 — Crear el CSS de entrada

Como el proyecto no tiene un CSS global propio (todo se inyectaba vía `@astrojs/tailwind`), crear:

**Nuevo:** `src/styles/global.css`

```css
@import "tailwindcss";

/* Modo oscuro con clase manual (sustituye darkMode: "class" del config v3) */
@custom-variant dark (&:where(.dark, .dark *));

/* Theme: portado desde tailwind.config.mjs */
@theme {
  --font-vivaldi: "Vivaldi", cursive;
  --font-dancing-script: "Dancing Script", cursive;

  --animate-spin-slow: spin 4s linear infinite;
  --animate-gradient: gradient 3s ease infinite;

  --inset-2px: 2px;

  @keyframes gradient {
    0%, 100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }
}

/* Equivalente al <style is:global> de Layout.astro — opcional centralizar aquí */
html {
  scroll-padding-top: 85px;
  font-family: "Poppins", sans-serif;
}
body {
  font-family: "Poppins", sans-serif;
}
```

Importar el CSS desde [src/layouts/Layout.astro](src/layouts/Layout.astro) (o desde cada página si se prefiere granular):

```astro
---
import "../styles/global.css";
import { ViewTransitions } from "astro:transitions";
// ...
---
```

### Paso 6 — Eliminar `tailwind.config.mjs`

Una vez portado el `theme.extend` al `@theme` del CSS:

- [ ] Borrar [tailwind.config.mjs](tailwind.config.mjs).
- [ ] (Alternativa) Si conviene mantener el config JS por compatibilidad con plugins, dejarlo y referenciarlo en el CSS con `@config "../../tailwind.config.mjs";`.

### Paso 7 — Adaptar `@apply` en componentes Vue

En v4, `@apply` dentro de `<style scoped>` requiere que las utilidades sean conocidas en ese ámbito. Hay dos opciones:

**Opción A (recomendada):** añadir `@reference` al inicio de cada bloque que use `@apply`:

```vue
<style scoped>
@reference "../styles/global.css";

.boton-tab {
  @apply flex items-center gap-2 px-4 py-2 rounded-full;
}
</style>
```

**Opción B:** sustituir los `@apply` por clases directas en el template (más idiomático en v4, pero más invasivo).

Archivos a revisar (todos los identificados con `@apply`):
- [src/components/SobreNosotros.vue](src/components/SobreNosotros.vue)
- [src/components/panel/AdminEventList.vue](src/components/panel/AdminEventList.vue)
- [src/components/panel/modals/EventoModal.vue](src/components/panel/modals/EventoModal.vue)
- [src/components/Anuncios/CarruselAnuncios.vue](src/components/Anuncios/CarruselAnuncios.vue)

### Paso 8 — Auditoría de utilidades renombradas

Tras correr el codemod, revisar manualmente uso de:
- `shadow-sm` → `shadow-xs` (y `shadow` → `shadow-sm` si se quiere mantener tamaño).
- `rounded-sm` → `rounded-xs` (idem `rounded` → `rounded-sm`).
- `blur-sm` → `blur-xs`.
- `outline-none` → `outline-hidden` (cuando se usa para ocultar el outline manteniendo accesibilidad).
- `ring` (sin valor) → `ring-3` (v4 usa 1px por defecto en `ring`).
- `bg-opacity-*`, `text-opacity-*`, `border-opacity-*` → sintaxis `color/opacidad` (`bg-black/50`).
- Bordes sin color: añadir color explícito o variable `--color-default-border`.

Comando útil para encontrar candidatos:

```bash
grep -rE "(shadow-sm|rounded-sm|blur-sm|outline-none|bg-opacity-|text-opacity-|border-opacity-)" src/
```

### Paso 9 — Verificar modo oscuro

- [ ] Confirmar que el toggle en [src/layouts/Layout.astro](src/layouts/Layout.astro) (líneas 14-24) sigue añadiendo la clase `dark` en `<html>`.
- [ ] Comprobar que `dark:` funciona en componentes (gracias al `@custom-variant dark` añadido en `global.css`).

### Paso 10 — Pruebas

- [ ] `npm run build` — sin errores ni warnings.
- [ ] `npm run dev` — recorrer manualmente las pantallas críticas:
  - Home / `Bienvenida`, `MenuInicio`, `Principal`, `Servicios`, `Ministerios`, `SobreNosotros`.
  - Carruseles (`CarruselAnuncios`).
  - Panel admin (`AdminEventList`, `AdminFechasList`, modales `FechaModal`, `EventoModal`).
  - Modales comunes (`BaseModal`, `ConfirmDialog`, `ProfileModal`, `CambioContrasena`).
  - Toggle modo oscuro.
- [ ] `npm test` — la suite de Vitest debe pasar.
- [ ] Revisar visualmente sombras, bordes, opacidades y espaciados (los puntos más comunes de regresión visual entre v3 y v4).

### Paso 11 — Limpieza y commit

- [ ] Eliminar archivos obsoletos (config viejos, dependencias huérfanas).
- [ ] `git diff` final y commit con mensaje descriptivo: `chore: migrar tailwind a v4 y reemplazar @astrojs/tailwind por @tailwindcss/vite`.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Regresiones visuales por utilidades renombradas | Codemod + auditoría manual del Paso 8 + revisión visual del Paso 10 |
| `@apply` dejando de resolver en componentes Vue scoped | Añadir `@reference` (Paso 7); fallback: cambiar a clases en template |
| Plugins de terceros incompatibles con v4 | Inventariar plugins (en este repo el array `plugins: []` está vacío, riesgo bajo) |
| Pérdida de keyframes/animaciones personalizadas | Portar explícitamente `gradient` y `spin-slow` al `@theme` (Paso 5) |
| Navegadores antiguos | Confirmar requisitos del público objetivo; v4 requiere Safari 16.4+ |
| Borrado prematuro del `tailwind.config.mjs` | Mantenerlo hasta que el build pase con el CSS nuevo, luego borrar |

---

## Rollback

Si surge un problema bloqueante:

```bash
git checkout main
git branch -D chore/tailwind-v4
npm install
```

El cambio está aislado en una rama y no toca lógica de negocio, por lo que el rollback es trivial.

---

## Checklist resumen

- [ ] Paso 0 — Baseline verde
- [ ] Paso 1 — Codemod `@tailwindcss/upgrade`
- [ ] Paso 2 — Eliminar `tailwind.config.js` duplicado
- [ ] Paso 3 — Actualizar dependencias
- [ ] Paso 4 — `astro.config.mjs` con `@tailwindcss/vite`
- [ ] Paso 5 — Crear `src/styles/global.css` con `@theme`
- [ ] Paso 6 — Eliminar `tailwind.config.mjs`
- [ ] Paso 7 — `@reference` en `<style scoped>` con `@apply`
- [ ] Paso 8 — Auditoría de utilidades renombradas
- [ ] Paso 9 — Verificar dark mode
- [ ] Paso 10 — Pruebas (build, dev, vitest, visual)
- [ ] Paso 11 — Commit y PR
