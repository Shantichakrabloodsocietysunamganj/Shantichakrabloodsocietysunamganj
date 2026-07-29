// সার্ভার-only: cookie থেকে ভাষা পড়া
import { cookies } from "next/headers";
import type { Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  try {
    const c = cookies().get("lang")?.value;
    return c === "en" ? "en" : "bn";
  } catch {
    return "bn";
  }
}
