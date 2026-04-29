const AVATAR_COLORS = [
  "#2196F3",
  "#4CAF50",
  "#F44336",
  "#9C27B0",
  "#FF9800",
  "#009688",
  "#E91E63",
  "#673AB7",
];

function avatarInitial(name?: string | null): string {
  return name ? name.charAt(0).toUpperCase() : "U";
}

function avatarColor(name?: string | null): string {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function useUserAvatar() {
  return { initial: avatarInitial, color: avatarColor };
}

export { AVATAR_COLORS, avatarInitial, avatarColor };
