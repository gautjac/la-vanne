import type { Context } from "@netlify/functions";
import {
  dealPremise,
  generateHeckle,
  generateRoomRead,
  type HeckleHistory,
  type Lang,
} from "./lib/room.ts";

interface Body {
  mode?: "deal" | "heckle" | "read";
  lang?: Lang;
  persona?: number;
  premise?: string;
  latest?: string;
  history?: HeckleHistory[];
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const lang: Lang = body.lang === "en" ? "en" : "fr";
  const persona = clampPersona(body.persona);
  const mode = body.mode ?? "heckle";
  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];

  // Haiku is fast — plain JSON, no NDJSON keepalive needed.
  try {
    if (mode === "deal") {
      return json({ result: await dealPremise(lang) });
    }
    if (mode === "read") {
      const premise = (body.premise ?? "").trim();
      return json({ result: await generateRoomRead(premise, history, persona, lang) });
    }
    // default: heckle
    const premise = (body.premise ?? "").trim();
    const latest = (body.latest ?? "").trim();
    if (!latest) {
      return json(
        {
          error: lang === "en" ? "Say something first." : "Dis quelque chose d'abord.",
        },
        400,
      );
    }
    return json({ result: await generateHeckle(premise, history, latest, persona, lang) });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : lang === "en" ? "Unknown error" : "Erreur inconnue";
    return json({ error: message }, 500);
  }
};

function clampPersona(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 60;
  return Math.max(0, Math.min(100, Math.round(n)));
}
