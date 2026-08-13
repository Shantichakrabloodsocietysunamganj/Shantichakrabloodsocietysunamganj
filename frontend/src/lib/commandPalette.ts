export const OPEN_PALETTE_EVENT = "shanti:cmdk";

export function openCommandPalette() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}
