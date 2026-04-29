export interface IconOption {
  value: string;
  label: string;
  colorClass: string;
  icon: string;
  colorName: string;
  noTooltip?: boolean;
}

export const iconOptions: IconOption[] = [
  {
    value: "Info",
    label: "Info",
    colorClass: "bg-teal-500",
    icon: "default.svg",
    colorName: "Verde Azulado",
    noTooltip: true,
  },
  {
    value: "Reunión de jovenes",
    label: "Reunión de jovenes",
    colorClass: "bg-indigo-500",
    icon: "reunion-de-jovenes.svg",
    colorName: "Índigo",
  },
  {
    value: "Cumpleaños",
    label: "Cumpleaños",
    colorClass: "bg-yellow-500",
    icon: "cumple.svg",
    colorName: "Amarillo",
  },
  {
    value: "Canasta de amor",
    label: "Canasta de amor",
    colorClass: "bg-red-500",
    icon: "canasta-de-amor.svg",
    colorName: "Rojo",
  },
  {
    value: "Cena del Señor",
    label: "Cena del Señor",
    colorClass: "bg-red-700",
    icon: "cena-del-senor.svg",
    colorName: "Rojo Oscuro",
  },
  {
    value: "Reunión de damas",
    label: "Reunión de damas",
    colorClass: "bg-pink-500",
    icon: "reunion-de-damas.svg",
    colorName: "Rosa",
  },
  {
    value: "Reunión de varones",
    label: "Reunión de varones",
    colorClass: "bg-blue-500",
    icon: "reunion-de-varones.svg",
    colorName: "Azul",
  },
  {
    value: "Domingo misionero",
    label: "Domingo misionero",
    colorClass: "bg-green-500",
    icon: "domingo-misionero.svg",
    colorName: "Verde",
  },
  {
    value: "Culto de oración",
    label: "Culto de oración",
    colorClass: "bg-violet-500",
    icon: "culto-de-oracion.svg",
    colorName: "Violeta",
  },
  {
    value: "Noches navideñas",
    label: "Noches navideñas",
    colorClass: "bg-red-400",
    icon: "noches-navidenas.svg",
    colorName: "Rojo Navidad",
  },
  {
    value: "Reuniones caseras",
    label: "Reuniones caseras",
    colorClass: "bg-orange-500",
    icon: "reuniones-caseras.svg",
    colorName: "Naranja",
  },
];

// Las clases se declaran literalmente para que Tailwind las detecte al escanear
// este archivo (no se construyen dinámicamente con string concatenation).
const ICON_COLOR_VARIANTS: Record<string, { bg: string; "border-t": string; text: string; border: string }> = {
  Info:                    { bg: "bg-teal-500",    "border-t": "border-t-teal-500",    text: "text-teal-500",    border: "border-teal-500" },
  "Reunión de jovenes":    { bg: "bg-indigo-500",  "border-t": "border-t-indigo-500",  text: "text-indigo-500",  border: "border-indigo-500" },
  "Cumpleaños":            { bg: "bg-yellow-500",  "border-t": "border-t-yellow-500",  text: "text-yellow-500",  border: "border-yellow-500" },
  "Canasta de amor":       { bg: "bg-red-500",     "border-t": "border-t-red-500",     text: "text-red-500",     border: "border-red-500" },
  "Cena del Señor":        { bg: "bg-red-700",     "border-t": "border-t-red-700",     text: "text-red-700",     border: "border-red-700" },
  "Reunión de damas":      { bg: "bg-pink-500",    "border-t": "border-t-pink-500",    text: "text-pink-500",    border: "border-pink-500" },
  "Reunión de varones":    { bg: "bg-blue-500",    "border-t": "border-t-blue-500",    text: "text-blue-500",    border: "border-blue-500" },
  "Domingo misionero":     { bg: "bg-green-500",   "border-t": "border-t-green-500",   text: "text-green-500",   border: "border-green-500" },
  "Culto de oración":      { bg: "bg-violet-500",  "border-t": "border-t-violet-500",  text: "text-violet-500",  border: "border-violet-500" },
  "Noches navideñas":      { bg: "bg-red-400",     "border-t": "border-t-red-400",     text: "text-red-400",     border: "border-red-400" },
  "Reuniones caseras":     { bg: "bg-orange-500",  "border-t": "border-t-orange-500",  text: "text-orange-500",  border: "border-orange-500" },
};

const FALLBACK_VARIANTS = ICON_COLOR_VARIANTS.Info;

/**
 * Devuelve la clase de color asociada al tipo de evento con el prefijo solicitado.
 * Las variantes se enumeran estáticamente para que Tailwind las detecte.
 */
export function getIconColorClass(
  tipo: string | null | undefined,
  prefix: "bg" | "border-t" | "text" | "border" = "bg",
): string {
  const variants = (tipo && ICON_COLOR_VARIANTS[tipo]) || FALLBACK_VARIANTS;
  return variants[prefix];
}
