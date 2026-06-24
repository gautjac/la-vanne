import { useSyncExternalStore } from "react";

export type Lang = "fr" | "en";

const KEY = "atelier:lang";

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "fr" || saved === "en") return saved;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || "fr").toLowerCase();
  return nav.startsWith("en") ? "en" : "fr";
}

let current: Lang = detect();
const listeners = new Set<() => void>();

function emit() {
  document.documentElement.lang = current;
  listeners.forEach((l) => l());
}

// set on first load
document.documentElement.lang = current;

export function setLang(l: Lang) {
  if (l === current) return;
  current = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* ignore */
  }
  emit();
}

export function toggleLang() {
  setLang(current === "fr" ? "en" : "fr");
}

export function getLang(): Lang {
  return current;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** React hook — returns the current language and re-renders on change. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang);
}

/** Pick fr/en by current language. */
export function t(fr: string, en: string): string {
  return current === "fr" ? fr : en;
}

/** Hook variant for components — re-renders when language flips. */
export function useT(): (fr: string, en: string) => string {
  const lang = useLang();
  return (fr: string, en: string) => (lang === "fr" ? fr : en);
}
