"use client";

const STORAGE_KEY = "shantichakra:owned-blood-requests:v1";
const MAX_OWNED_REQUESTS = 20;
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

export type OwnedBloodRequest = {
  id: string;
  token: string;
  patientName: string;
  bloodGroup: string;
  createdAt: string;
  nextPromptAt: string;
};

function available() {
  return typeof window !== "undefined";
}

export function createManagementToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function firstFollowUpAt(neededDate: string) {
  const createdFollowUp = Date.now() + 12 * 60 * 60 * 1000;
  // Ask after 6pm on the date blood was needed. For same-day requests, wait at
  // least 12 hours so the success screen is never immediately followed by it.
  const neededFollowUp = new Date(`${neededDate}T18:00:00`).getTime();
  return new Date(Math.max(createdFollowUp, neededFollowUp || 0)).toISOString();
}

export function getOwnedBloodRequests(): OwnedBloodRequest[] {
  if (!available()) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as OwnedBloodRequest[];
    const cutoff = Date.now() - MAX_AGE_MS;
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.id && item?.token && new Date(item.createdAt).getTime() > cutoff)
      : [];
  } catch {
    return [];
  }
}

function write(items: OwnedBloodRequest[]) {
  if (!available()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_OWNED_REQUESTS)));
  } catch {
    // Some private/restricted browsers disable localStorage.
  }
}

export function rememberOwnedBloodRequest(item: OwnedBloodRequest) {
  const items = getOwnedBloodRequests().filter((entry) => entry.id !== item.id);
  write([item, ...items]);
}

export function postponeOwnedBloodRequest(id: string, hours = 24) {
  const nextPromptAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  write(getOwnedBloodRequests().map((item) => item.id === id ? { ...item, nextPromptAt } : item));
  return nextPromptAt;
}

export function forgetOwnedBloodRequest(id: string) {
  write(getOwnedBloodRequests().filter((item) => item.id !== id));
}
