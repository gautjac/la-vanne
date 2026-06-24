import Anthropic from "@anthropic-ai/sdk";

export type Lang = "fr" | "en";

const MODEL = "claude-opus-4-8"; // depth — l'atelier + générateurs
const FAST = "claude-haiku-4-5"; // low-latency — heckles in le passage

export function client(): Anthropic {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("Server missing CLAUDE_API_KEY");
  return new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });
}

export function langName(l: Lang): string {
  return l === "fr" ? "French (Québécois — joual welcome)" : "English";
}

// ── The house voice ─────────────────────────────────────────────────────────
// A real comedy-room sensibility: knows the mechanics cold, funny, blunt, but
// NEVER punches down. Targets are the material, never protected groups.
const SAFETY = `Hard rule: you roast the JOKE and the WRITING, never the writer as a person and never any protected group (race, religion, gender, sexuality, disability, ethnicity). If the user's material itself punches down, say so plainly and steer them to a target that's fair game (the powerful, the absurd, the self). Stay playful, never cruel about people.`;

export function roomVoice(persona: number, lang: Lang): string {
  // persona: 0 = gentle open-mic host … 100 = vicious late-night room
  let tier: string;
  if (persona <= 20) {
    tier =
      "You are a warm open-mic host. Encouraging, generous, you find the spark in anything and protect a nervous new writer. You still tell the truth about the craft, but gently.";
  } else if (persona <= 50) {
    tier =
      "You are a sharp but fair comedy-room editor. You name what works and what doesn't with no padding, like a good writers'-room peer. Dry wit allowed.";
  } else if (persona <= 80) {
    tier =
      "You are a tough late-night room. You've heard everything. You're funny, fast, and impatient with lazy writing. You praise only what earns it, and your notes have teeth.";
  } else {
    tier =
      "You are a vicious 2-drink-minimum back-room crowd at 1am. Brutal, hilarious, relentless. You will eat a weak joke alive — but it is always ABOUT THE JOKE, never the person, and you still hand over real craft underneath the savagery.";
  }
  const joual =
    lang === "fr"
      ? " Tu écris en québécois vivant — du joual quand ça punche, des sacres légers tolérés (tabarnak, câlisse) mais jamais gratuits, jamais traduit de l'anglais."
      : "";
  return `${tier}${joual}\n\nYou know the real mechanics of jokes cold: setup vs punchline, the funny word goes LAST, misdirection/the turn, the rule of three, the "game" of a joke (the one absurd premise you heighten), specificity beats abstraction, act-outs, callbacks, tags, comic persona, brevity. You diagnose with those tools, concretely.\n\n${SAFETY}`;
}

// ────────────────────────────────────────────────────────────────────────────
// L'ATELIER — structured room notes (Opus, forced tool-use)
// ────────────────────────────────────────────────────────────────────────────
export interface RoomNotes {
  verdict: string;
  surprise: string;
  funnyWordLast: { ok: boolean; comment: string };
  setupLength: { ok: boolean; comment: string };
  theGame: string;
  altPunchlines: string[];
  rewrite: string;
  oneMore: string;
}

const NOTES_TOOL: Anthropic.Tool = {
  name: "deliver_notes",
  description:
    "Deliver structured comedy-room notes on the user's joke or bit: diagnose the surprise, the funny-word placement, the setup length, the game, give 3 alternate punchlines, a tightened rewrite, and one more nudge.",
  input_schema: {
    type: "object",
    required: [
      "verdict",
      "surprise",
      "funnyWordLast",
      "setupLength",
      "theGame",
      "altPunchlines",
      "rewrite",
      "oneMore",
    ],
    properties: {
      verdict: {
        type: "string",
        description:
          "One punchy in-character gut reaction to the bit (1 sentence). Match the room's persona.",
      },
      surprise: {
        type: "string",
        description:
          "Where the surprise/turn is — or, honestly, that there isn't one yet and why. Point to the actual words.",
      },
      funnyWordLast: {
        type: "object",
        required: ["ok", "comment"],
        properties: {
          ok: { type: "boolean", description: "true if the funniest word lands at/near the end." },
          comment: {
            type: "string",
            description:
              "What the funny word is and where it sits; if buried, name the word and where it should go.",
          },
        },
      },
      setupLength: {
        type: "object",
        required: ["ok", "comment"],
        properties: {
          ok: { type: "boolean", description: "true if the setup is tight enough." },
          comment: {
            type: "string",
            description: "Is the setup carrying dead weight? Name the words to cut, or say it's lean.",
          },
        },
      },
      theGame: {
        type: "string",
        description:
          "The 'game' of the joke: the one absurd/illogical premise to find and heighten. Name it in one crisp line. If there's no game yet, propose the most promising one hiding in the premise.",
      },
      altPunchlines: {
        type: "array",
        items: { type: "string" },
        minItems: 3,
        maxItems: 3,
        description:
          "Exactly 3 alternate punchlines for the SAME setup — genuinely different angles/turns, each actually funny, funny word last.",
      },
      rewrite: {
        type: "string",
        description:
          "A tightened rewrite of the whole bit: leaner setup, sharper turn, funny word last. Keep the writer's voice — improve, don't replace.",
      },
      oneMore: {
        type: "string",
        description:
          "One final move: a tag riffing off the punchline, or the single most valuable next thing to try.",
      },
    },
  },
};

export async function generateNotes(
  joke: string,
  persona: number,
  lang: Lang,
): Promise<RoomNotes> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 1600,
    system: roomVoice(persona, lang),
    messages: [
      {
        role: "user",
        content: [
          `Give room notes on this bit, written entirely in ${langName(lang)}. Be concrete — quote the actual words. Stay fully in character for the room's intensity.`,
          "",
          "THE BIT:",
          joke,
          "",
          "Respond ONLY by calling deliver_notes.",
        ].join("\n"),
      },
    ],
    tools: [NOTES_TOOL],
    tool_choice: { type: "tool", name: "deliver_notes" },
  });
  const tool = res.content.find((b) => b.type === "tool_use");
  if (!tool || tool.type !== "tool_use") throw new Error("No notes returned");
  const i = tool.input as Record<string, unknown>;
  const fw = (i.funnyWordLast ?? {}) as Record<string, unknown>;
  const sl = (i.setupLength ?? {}) as Record<string, unknown>;
  return {
    verdict: String(i.verdict ?? ""),
    surprise: String(i.surprise ?? ""),
    funnyWordLast: { ok: Boolean(fw.ok), comment: String(fw.comment ?? "") },
    setupLength: { ok: Boolean(sl.ok), comment: String(sl.comment ?? "") },
    theGame: String(i.theGame ?? ""),
    altPunchlines: ((i.altPunchlines as string[]) ?? []).slice(0, 3),
    rewrite: String(i.rewrite ?? ""),
    oneMore: String(i.oneMore ?? ""),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// GÉNÉRATEURS — premises / act-outs / tags / callbacks (Opus, forced tool-use)
// ────────────────────────────────────────────────────────────────────────────
export type SparkKind = "premise" | "actout" | "tags" | "callback";

export interface SparkResult {
  kind: SparkKind;
  lines: string[];
  note: string;
}

const SPARK_TOOL: Anthropic.Tool = {
  name: "deliver_spark",
  description: "Deliver generator output for a comedy-writing tool.",
  input_schema: {
    type: "object",
    required: ["lines", "note"],
    properties: {
      lines: {
        type: "array",
        items: { type: "string" },
        description: "The generated items (premises, act-out prompts, tags, or callback suggestions).",
      },
      note: {
        type: "string",
        description: "One short line of guidance on how to use these (in character, light).",
      },
    },
  },
};

function sparkPrompt(kind: SparkKind, input: string, lang: Lang): string {
  const L = langName(lang);
  switch (kind) {
    case "premise":
      return [
        `Generate 6 fresh, specific comedy PREMISES in ${L}. Each is a setup-shaped observation with an obvious 'game' to heighten — not a finished joke. Concrete, surprising, never the usual airline/airport hack stuff.`,
        input ? `Theme/seed to riff on: ${input}` : "Range across everyday life, the absurd, the personal.",
        "Put each premise in lines[]. note = one line on picking one and finding its game.",
      ].join("\n");
    case "actout":
      return [
        `Generate 5 ACT-OUT prompts in ${L}: small physical/vocal moments a comic could perform on stage (a character voice, a gesture, a re-enactment) that would get a laugh from being SHOWN not told.`,
        input ? `Tie them to: ${input}` : "Make them broadly usable.",
        "Put each prompt in lines[]. note = one line on why act-outs land.",
      ].join("\n");
    case "tags":
      return [
        `Here is a PUNCHLINE in ${L}. Generate exactly 3 TAGS — extra punchlines that riff off the SAME laugh without a new setup, each escalating or twisting. Funny word last.`,
        `PUNCHLINE: ${input}`,
        "Put the 3 tags in lines[]. note = one line on tagging.",
      ].join("\n");
    case "callback":
      return [
        `Here is a comedy SET (multiple bits/lines) in ${L}. Find the strongest earlier line to CALL BACK to near the end, and say exactly how to weld the callback in. Suggest up to 2 options.`,
        `THE SET:\n${input}`,
        "Put each callback suggestion (which line + the move) in lines[]. note = one line on why callbacks kill.",
      ].join("\n");
  }
}

export async function generateSpark(
  kind: SparkKind,
  input: string,
  lang: Lang,
): Promise<SparkResult> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 1100,
    system: roomVoice(35, lang), // a sharp, fair writers'-room voice for tools
    messages: [
      {
        role: "user",
        content: sparkPrompt(kind, input, lang) + "\n\nRespond ONLY by calling deliver_spark.",
      },
    ],
    tools: [SPARK_TOOL],
    tool_choice: { type: "tool", name: "deliver_spark" },
  });
  const tool = res.content.find((b) => b.type === "tool_use");
  if (!tool || tool.type !== "tool_use") throw new Error("No spark returned");
  const i = tool.input as Record<string, unknown>;
  return {
    kind,
    lines: ((i.lines as string[]) ?? []).filter((s) => s && s.trim()),
    note: String(i.note ?? ""),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// LE PASSAGE — fast turn-by-turn heckles + a closing room read (Haiku)
// ────────────────────────────────────────────────────────────────────────────
export interface HeckleTurn {
  heckle: string;
  energy: number;
}

export interface RoomRead {
  read: string;
  highlight: string;
  note: string;
  score: number;
}

const HECKLE_TOOL: Anthropic.Tool = {
  name: "react",
  description: "React to the comic's latest line from the crowd, in character.",
  input_schema: {
    type: "object",
    required: ["heckle", "energy"],
    properties: {
      heckle: {
        type: "string",
        description:
          "The crowd's reaction to the comic's LATEST line — 1-2 short sentences, in character. Could be a laugh, a groan, a heckle, a callback. Keep it snappy and live.",
      },
      energy: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description: "How the room is feeling RIGHT NOW (0 = stone silence, 100 = on fire).",
      },
    },
  },
};

const READ_TOOL: Anthropic.Tool = {
  name: "room_read",
  description: "Give the closing room read after the set, in character.",
  input_schema: {
    type: "object",
    required: ["read", "highlight", "note", "score"],
    properties: {
      read: { type: "string", description: "2-4 sentences: the room's honest closing reaction, in character." },
      highlight: { type: "string", description: "The single best moment they landed (quote it)." },
      note: { type: "string", description: "One craft note to take home." },
      score: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description: "This ONE room's reaction as a number (NOT an objective measure of funny).",
      },
    },
  },
};

export interface HeckleHistory {
  role: "comic" | "room";
  text: string;
}

export async function generateHeckle(
  premise: string,
  history: HeckleHistory[],
  latest: string,
  persona: number,
  lang: Lang,
  temperature = 0.9,
): Promise<HeckleTurn> {
  const convo = history
    .map((h) => (h.role === "comic" ? `COMIC: ${h.text}` : `ROOM: ${h.text}`))
    .join("\n");
  const res = await client().messages.create({
    model: FAST,
    max_tokens: 280,
    temperature,
    system:
      roomVoice(persona, lang) +
      `\n\nYou are the live crowd during a 60-second spot. The comic is riffing on a premise you handed them. React to their LATEST line only, fast and in character. Do not write jokes for them. Keep it to 1-2 short lines.`,
    messages: [
      {
        role: "user",
        content: [
          `Premise you gave the comic, in ${langName(lang)}: ${premise}`,
          convo ? `\nSo far:\n${convo}` : "",
          `\nCOMIC just said: ${latest}`,
          "\nReact now. Respond ONLY by calling react.",
        ].join("\n"),
      },
    ],
    tools: [HECKLE_TOOL],
    tool_choice: { type: "tool", name: "react" },
  });
  const tool = res.content.find((b) => b.type === "tool_use");
  if (!tool || tool.type !== "tool_use") throw new Error("No heckle returned");
  const i = tool.input as Record<string, unknown>;
  return {
    heckle: String(i.heckle ?? ""),
    energy: clampInt(i.energy, 50),
  };
}

export async function generateRoomRead(
  premise: string,
  history: HeckleHistory[],
  persona: number,
  lang: Lang,
  temperature = 0.85,
): Promise<RoomRead> {
  const convo = history
    .map((h) => (h.role === "comic" ? `COMIC: ${h.text}` : `ROOM: ${h.text}`))
    .join("\n");
  const res = await client().messages.create({
    model: FAST,
    max_tokens: 420,
    temperature,
    system:
      roomVoice(persona, lang) +
      `\n\nThe 60-second spot just ended. Give the closing room read in ${langName(lang)}. Be honest but remember a score is just THIS room on THIS night — comedy is subjective. Stay in character.`,
    messages: [
      {
        role: "user",
        content: [
          `Premise: ${premise}`,
          `\nThe set:\n${convo}`,
          "\nRespond ONLY by calling room_read.",
        ].join("\n"),
      },
    ],
    tools: [READ_TOOL],
    tool_choice: { type: "tool", name: "room_read" },
  });
  const tool = res.content.find((b) => b.type === "tool_use");
  if (!tool || tool.type !== "tool_use") throw new Error("No room read returned");
  const i = tool.input as Record<string, unknown>;
  return {
    read: String(i.read ?? ""),
    highlight: String(i.highlight ?? ""),
    note: String(i.note ?? ""),
    score: clampInt(i.score, 50),
  };
}

// A fast premise/first-line dealer for le passage (Haiku, plain return)
export async function dealPremise(lang: Lang): Promise<{ premise: string; firstLine: string }> {
  const res = await client().messages.create({
    model: FAST,
    max_tokens: 200,
    temperature: 1.0,
    system: roomVoice(30, lang),
    messages: [
      {
        role: "user",
        content: `Deal one fresh, specific comedy premise AND one possible opening line for a 60-second riff, in ${langName(lang)}. Surprising, concrete, performable. Respond ONLY by calling deal.`,
      },
    ],
    tools: [
      {
        name: "deal",
        description: "Deal a premise and a first line.",
        input_schema: {
          type: "object",
          required: ["premise", "firstLine"],
          properties: {
            premise: { type: "string", description: "A specific premise to riff on." },
            firstLine: { type: "string", description: "A possible opening line the comic can keep or ditch." },
          },
        },
      },
    ],
    tool_choice: { type: "tool", name: "deal" },
  });
  const tool = res.content.find((b) => b.type === "tool_use");
  if (!tool || tool.type !== "tool_use") throw new Error("No premise returned");
  const i = tool.input as Record<string, unknown>;
  return { premise: String(i.premise ?? ""), firstLine: String(i.firstLine ?? "") };
}

function clampInt(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}
