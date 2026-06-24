import type { Lang } from "./i18n";
import type {
  HeckleTurn,
  RoomNotes,
  RoomRead,
  SparkKind,
  SparkResult,
} from "./types";

/**
 * NDJSON reader: Opus endpoints stream keepalive newlines during the long call,
 * then a final JSON line with { result } or { error }. We read to end-of-stream
 * and parse the last non-empty line. Tolerates a plain JSON body too.
 */
async function readNdjson<T>(res: Response, en: boolean): Promise<T> {
  const raw = await res.text();
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const last = lines[lines.length - 1] ?? "";

  let parsed: { result?: T; error?: string } | null = null;
  try {
    parsed = last ? JSON.parse(last) : null;
  } catch {
    parsed = null;
  }

  const invalid = en ? "Invalid response from the room." : "Réponse invalide de la salle.";
  if (!res.ok) {
    const fallback = en ? `Error ${res.status}` : `Erreur ${res.status}`;
    throw new Error(parsed?.error || fallback);
  }
  if (!parsed) throw new Error(invalid);
  if (parsed.error) throw new Error(parsed.error);
  if (parsed.result !== undefined) return parsed.result;
  throw new Error(invalid);
}

async function readJson<T>(res: Response, en: boolean): Promise<T> {
  let parsed: { result?: T; error?: string } | null = null;
  try {
    parsed = (await res.json()) as { result?: T; error?: string };
  } catch {
    parsed = null;
  }
  if (!res.ok) {
    const fallback = en ? `Error ${res.status}` : `Erreur ${res.status}`;
    throw new Error(parsed?.error || fallback);
  }
  if (!parsed) throw new Error(en ? "Invalid response." : "Réponse invalide.");
  if (parsed.error) throw new Error(parsed.error);
  if (parsed.result !== undefined) return parsed.result;
  throw new Error(en ? "Invalid response." : "Réponse invalide.");
}

// ── L'atelier ────────────────────────────────────────────────────────────────
export async function fetchNotes(
  joke: string,
  persona: number,
  lang: Lang,
): Promise<RoomNotes> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ joke, persona, lang }),
  });
  return readNdjson<RoomNotes>(res, lang === "en");
}

// ── Générateurs ──────────────────────────────────────────────────────────────
export async function fetchSpark(
  kind: SparkKind,
  input: string,
  lang: Lang,
): Promise<SparkResult> {
  const res = await fetch("/api/spark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, input, lang }),
  });
  return readNdjson<SparkResult>(res, lang === "en");
}

// ── Le passage (Haiku, plain JSON) ──────────────────────────────────────────
export interface HeckleHistory {
  role: "comic" | "room";
  text: string;
}

export async function dealPremise(
  lang: Lang,
): Promise<{ premise: string; firstLine: string }> {
  const res = await fetch("/api/heckle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "deal", lang }),
  });
  return readJson<{ premise: string; firstLine: string }>(res, lang === "en");
}

export async function fetchHeckle(
  premise: string,
  history: HeckleHistory[],
  latest: string,
  persona: number,
  lang: Lang,
): Promise<HeckleTurn> {
  const res = await fetch("/api/heckle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "heckle", premise, history, latest, persona, lang }),
  });
  return readJson<HeckleTurn>(res, lang === "en");
}

export async function fetchRoomRead(
  premise: string,
  history: HeckleHistory[],
  persona: number,
  lang: Lang,
): Promise<RoomRead> {
  const res = await fetch("/api/heckle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "read", premise, history, persona, lang }),
  });
  return readJson<RoomRead>(res, lang === "en");
}
