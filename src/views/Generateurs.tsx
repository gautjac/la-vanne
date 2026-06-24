import { useState } from "react";
import { fetchSpark } from "../api";
import { saveBit } from "../db";
import { useLang, useT } from "../i18n";
import type { SparkKind, SparkResult } from "../types";
import { RoomLoading } from "../ui";

interface Gen {
  kind: SparkKind;
  emoji: string;
  title: { fr: string; en: string };
  blurb: { fr: string; en: string };
  needsInput: boolean;
  placeholder: { fr: string; en: string };
}

const GENS: Gen[] = [
  {
    kind: "premise",
    emoji: "💡",
    title: { fr: "Générateur de prémisses", en: "Premise generator" },
    blurb: {
      fr: "Six prémisses fraîches, chacune avec un game évident à monter.",
      en: "Six fresh premises, each with an obvious game to heighten.",
    },
    needsInput: false,
    placeholder: { fr: "Optionnel : un thème (ex. les rendez-vous, l'hiver)…", en: "Optional: a theme (e.g. dating, winter)…" },
  },
  {
    kind: "actout",
    emoji: "🎭",
    title: { fr: "Prompts d'act-out", en: "Act-out prompts" },
    blurb: {
      fr: "Cinq moments à JOUER sur scène plutôt qu'à raconter.",
      en: "Five moments to PERFORM on stage instead of narrating.",
    },
    needsInput: false,
    placeholder: { fr: "Optionnel : un sujet à incarner…", en: "Optional: a subject to embody…" },
  },
  {
    kind: "tags",
    emoji: "🏷️",
    title: { fr: "Machine à tags", en: "Tag machine" },
    blurb: {
      fr: "Colle une chute → 3 tags qui escaladent sans re-setup.",
      en: "Paste a punchline → 3 tags that escalate with no re-setup.",
    },
    needsInput: true,
    placeholder: { fr: "Colle ta chute ici…", en: "Paste your punchline here…" },
  },
  {
    kind: "callback",
    emoji: "🔁",
    title: { fr: "Chercheur de callback", en: "Callback finder" },
    blurb: {
      fr: "Colle ton set → la meilleure ligne à rappeler à la fin.",
      en: "Paste your set → the best earlier line to call back to.",
    },
    needsInput: true,
    placeholder: { fr: "Colle ton set complet ici…", en: "Paste your whole set here…" },
  },
];

const LOADING = {
  fr: ["On allume le projecteur…", "On cherche l'angle…", "Ça vient…"],
  en: ["Warming the spotlight…", "Finding the angle…", "Almost there…"],
};

export default function Generateurs() {
  const lang = useLang();
  const t = useT();
  const [active, setActive] = useState<SparkKind>("premise");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SparkResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gen = GENS.find((g) => g.kind === active)!;

  async function run() {
    if (gen.needsInput && input.trim().length < 4) {
      setError(t("Colle quelque chose d'abord.", "Paste something first."));
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const r = await fetchSpark(active, input, lang);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function pick(k: SparkKind) {
    setActive(k);
    setResult(null);
    setError(null);
    setInput("");
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-wide text-cream">
          {t("LES GÉNÉRATEURS", "THE GENERATORS")}
        </h2>
        <p className="text-cream/70 mt-2 max-w-xl mx-auto">
          {t("Quatre machines pour débloquer l'écriture.", "Four machines to unstick your writing.")}
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {GENS.map((g) => (
          <button
            key={g.kind}
            onClick={() => pick(g.kind)}
            className={`panel p-4 text-left transition-all ${
              active === g.kind ? "border-amber/70 shadow-spot-sm" : "hover:border-amber/40"
            }`}
          >
            <div className="text-2xl">{g.emoji}</div>
            <h3 className="font-marquee text-lg tracking-wide text-cream mt-1">{g.title[lang]}</h3>
          </button>
        ))}
      </div>

      <div className="panel p-6 space-y-4">
        <p className="text-cream/80">{gen.blurb[lang]}</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={gen.kind === "callback" ? 5 : 2}
          placeholder={gen.placeholder[lang]}
          className="field resize-y"
        />
        <button onClick={run} disabled={loading} className="btn-primary">
          {gen.emoji} {t("Générer", "Generate")}
        </button>
        {error && <p className="text-neon-red text-sm">{error}</p>}
      </div>

      {loading && (
        <div className="panel">
          <RoomLoading messages={lang === "fr" ? LOADING.fr : LOADING.en} />
        </div>
      )}

      {result && !loading && (
        <div className="panel-raise p-6 animate-riseIn space-y-3">
          <ul className="space-y-2">
            {result.lines.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl bg-night-deep/60 border border-amber-dim/20 p-3"
              >
                <span className="font-mono text-amber shrink-0">{i + 1}.</span>
                <span className="text-cream/90 flex-1">{line}</span>
                <button
                  onClick={() => saveBit(line, "générateur", [result.kind], 0)}
                  className="text-xs text-amber/70 hover:text-amber shrink-0"
                  title={t("Sauver", "Save")}
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
          {result.note && <p className="text-sm text-amber/80 italic">{result.note}</p>}
        </div>
      )}
    </div>
  );
}
