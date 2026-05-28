import { nanoid } from "nanoid";
import { AVATAR_COLORS } from "@/constants";

export const createId = (prefix = ""): string =>
  prefix ? `${prefix}_${nanoid(12)}` : nanoid(12);

export const pickAvatarColor = (seed?: string): string => {
  if (!seed) return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
