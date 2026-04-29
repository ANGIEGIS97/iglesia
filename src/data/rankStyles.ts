export interface RankStyle {
  name: string;
  text: string;
  textLight: string;
  bg: string;
  bgWithText: string;
  badge: string;
}

export const RANK_STYLES: Record<number, RankStyle> = {
  1: {
    name: "Bronce",
    text: "text-amber-500",
    textLight: "text-amber-400",
    bg: "bg-amber-500",
    bgWithText: "bg-amber-500 text-amber-950",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100",
  },
  2: {
    name: "Plata",
    text: "text-gray-400",
    textLight: "text-gray-400",
    bg: "bg-gray-400",
    bgWithText: "bg-gray-400 text-gray-950",
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  },
  3: {
    name: "Oro",
    text: "text-yellow-500",
    textLight: "text-yellow-400",
    bg: "bg-yellow-500",
    bgWithText: "bg-yellow-500 text-yellow-950",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  },
  4: {
    name: "Diamante",
    text: "text-blue-500",
    textLight: "text-blue-400",
    bg: "bg-blue-500",
    bgWithText: "bg-blue-500 text-blue-950",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  },
  5: {
    name: "Platino",
    text: "text-purple-500",
    textLight: "text-purple-400",
    bg: "bg-purple-500",
    bgWithText: "bg-purple-500 text-purple-950",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
  },
};

const FALLBACK_RANK_STYLE: RankStyle = {
  name: "Sin rango",
  text: "text-teal-500",
  textLight: "text-yellow-400",
  bg: "bg-yellow-500",
  bgWithText: "bg-yellow-500 text-gray-900",
  badge: "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100",
};

export function getRankStyle(rank: number): RankStyle {
  return RANK_STYLES[rank] ?? FALLBACK_RANK_STYLE;
}
