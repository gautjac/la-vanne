import Dexie, { type Table } from "dexie";
import type { Bit } from "./types";

class VanneDB extends Dexie {
  bits!: Table<Bit, number>;

  constructor() {
    super("la-vanne");
    this.version(1).stores({
      // indexed: id, createdAt, rating; tags is multiEntry for filtering
      bits: "++id, createdAt, updatedAt, rating, *tags, source",
    });
  }
}

export const db = new VanneDB();

export async function saveBit(
  text: string,
  source: string,
  tags: string[] = [],
  rating = 0,
): Promise<number> {
  const now = Date.now();
  return db.bits.add({
    text: text.trim(),
    source,
    tags,
    rating,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateBit(id: number, patch: Partial<Bit>): Promise<void> {
  await db.bits.update(id, { ...patch, updatedAt: Date.now() });
}

export async function deleteBit(id: number): Promise<void> {
  await db.bits.delete(id);
}

export function bitsToMarkdown(bits: Bit[]): string {
  const lines: string[] = ["# Mon cahier — La Vanne", ""];
  const sorted = [...bits].sort((a, b) => b.updatedAt - a.updatedAt);
  for (const b of sorted) {
    const stars = "★".repeat(b.rating) + "☆".repeat(5 - b.rating);
    const tags = b.tags.length ? ` · ${b.tags.map((t) => `#${t}`).join(" ")}` : "";
    const date = new Date(b.createdAt).toLocaleDateString();
    lines.push(`## ${stars}${tags}`);
    lines.push(`_${date} · ${b.source}_`);
    lines.push("");
    lines.push(b.text);
    lines.push("");
    lines.push("---");
    lines.push("");
  }
  return lines.join("\n");
}
