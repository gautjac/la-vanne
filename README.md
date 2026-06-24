# La Vanne — l'atelier de la blague

A late-night comedy club you can practice in. La Vanne teaches the real mechanics of
jokes, gives you a write-along workbench where an AI comedy room dissects your bit, and
drops you on stage for a 60-second set in front of a heckling crowd.

_Une vanne_ = a joke / a jab, in Québécois slang.

## What's inside

- **Les mécaniques** — 11 short lessons on the machinery of funny (setup vs punchline,
  misdirection, the rule of three, the "game", specificity, act-outs, callbacks, tags,
  persona, brevity), each with a worked example you can dissect.
- **L'atelier** — write a joke; the room returns structured notes: where the surprise is,
  is the funny word last, is the setup too long, what's the game, 3 alternate punchlines,
  a tightened rewrite. A persona dial runs from gentle open-mic host to vicious late-night.
- **Le passage** — a dealt premise + a 60-second clock; riff (typed or voice-dictated)
  while a club AI heckles you turn by turn, then gives an honest "room read."
- **Les générateurs** — premise generator, act-out prompts, tag machine, callback finder.
- **Mon cahier** — save, rate, tag, filter and export your bits to Markdown (local, Dexie).

Bilingual FR-first / EN via the shared `atelier:lang` toggle. The room roasts the JOKE,
never the person, and never punches down.

## Stack

Vite + React 19 + TypeScript + Tailwind v3 + Dexie. Netlify Functions call the Claude API:
`/api/notes` & `/api/spark` use Opus (NDJSON keepalive), `/api/heckle` uses Haiku for
snappy live heckles.

## Dev

```
npm install
netlify dev      # needs CLAUDE_API_KEY in the Netlify env
```

Made at the Atelier · 🤖 with Claude Opus 4.8
