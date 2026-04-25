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
