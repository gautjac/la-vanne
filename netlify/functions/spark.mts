import type { Context } from "@netlify/functions";
import { generateSpark, type Lang, type SparkKind } from "./lib/room.ts";

interface Body {
  kind?: SparkKind;
  input?: string;
  lang?: Lang;
}

const KINDS: SparkKind[] = ["premise", "actout", "tags", "callback"];

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
  const kind = body.kind && KINDS.includes(body.kind) ? body.kind : "premise";
  const input = (body.input ?? "").trim();

  // tags & callback need user input; premise & actout can run with a seed or empty.
  if ((kind === "tags" || kind === "callback") && input.length < 4) {
    return json(
      {
        error:
          lang === "en"
            ? kind === "tags"
              ? "Paste a punchline to tag."
              : "Paste your set so I can find a callback."
            : kind === "tags"
              ? "Colle une chute à taguer."
              : "Colle ton set pour que je trouve un callback.",
      },
      400,
    );
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let done = false;
      const beat = setInterval(() => {
        if (!done) {
          try {
            controller.enqueue(enc.encode("\n"));
          } catch {
            /* closed */
          }
        }
      }, 3000);

      try {
        const result = await generateSpark(kind, input, lang);
        done = true;
        clearInterval(beat);
        controller.enqueue(enc.encode(JSON.stringify({ result }) + "\n"));
      } catch (err) {
        done = true;
        clearInterval(beat);
        const message =
          err instanceof Error ? err.message : lang === "en" ? "Unknown error" : "Erreur inconnue";
        controller.enqueue(enc.encode(JSON.stringify({ error: message }) + "\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
};
