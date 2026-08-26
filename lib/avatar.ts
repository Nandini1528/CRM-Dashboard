const AVATAR_COLORS = [
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
    "bg-cyan-100 text-cyan-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
  ];

const AVATAR_BANNER_COLORS = [
    "bg-blue-50",
    "bg-amber-50",
    "bg-rose-50",
    "bg-violet-50",
    "bg-cyan-50",
    "bg-orange-50",
    "bg-pink-50",
    "bg-indigo-50",
  ];

function getAvatarColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_COLORS.length;
}
  
  export function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  export function getAvatarColor(name: string): string {
    return AVATAR_COLORS[getAvatarColorIndex(name)];
  }

  export function getAvatarBannerColor(name: string): string {
    return AVATAR_BANNER_COLORS[getAvatarColorIndex(name)];
  }
