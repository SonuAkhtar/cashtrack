export const createId = (prefix = "id"): string => {
  const rand = Math.random().toString(36).slice(2, 8);
  const stamp = Date.now().toString(36).slice(-4);
  return `${prefix}_${stamp}${rand}`;
};
