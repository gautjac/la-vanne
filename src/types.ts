import type { Lang } from "./i18n";

export type { Lang };

// ── Persona dial: 0 = gentle open-mic host … 100 = vicious late-night room ──
export type Persona = number;

// ── L'atelier — structured notes from the comedy room ──────────────────────
export interface RoomNotes {
  verdict: string; // one-line gut reaction, in character
  surprise: string; // where the surprise is, or that there isn't one
  funnyWordLast: { ok: boolean; comment: string }; // is the funny word last?
  setupLength: { ok: boolean; comment: string }; // is the setup too long?
  theGame: string; // what's the "game" of the joke?
  altPunchlines: string[]; // 3 alternate punchlines
  rewrite: string; // a tightened rewrite
  oneMore: string; // a final tag or nudge
}

// ── Le passage — a single heckle turn ──────────────────────────────────────
export interface HeckleTurn {
  heckle: string; // the room's reaction to the latest riff
  energy: number; // 0-100, how the room is feeling right now
}

export interface RoomRead {
  read: string; // the closing "room read" paragraph, in character
  highlight: string; // the best moment they landed
  note: string; // one craft note to take home
  score: number; // 0-100, framed honestly as ONE room's reaction
}

// ── Générateurs ────────────────────────────────────────────────────────────
export type SparkKind = "premise" | "actout" | "tags" | "callback";

export interface SparkResult {
  kind: SparkKind;
  // premise: lines = list of premises; actout: lines = act-out prompts
  // tags: lines = 3 tags off the punchline
  // callback: lines = suggested earlier line(s) to call back to + the move
  lines: string[];
  note?: string;
}

// ── Mon cahier — saved bits (Dexie) ────────────────────────────────────────
export interface Bit {
  id?: number;
  text: string;
  rating: number; // 0-5 stars
  tags: string[];
  source: string; // where it came from: "atelier" | "passage" | "manuel" | "main"
  createdAt: number;
  updatedAt: number;
}
