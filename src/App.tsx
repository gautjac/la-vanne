import { useState } from "react";
import { toggleLang, useLang, useT } from "./i18n";
import { NeonSign } from "./ui";
import Mecaniques from "./views/Mecaniques";
import Atelier from "./views/Atelier";
import Passage from "./views/Passage";
import Generateurs from "./views/Generateurs";
import Cahier from "./views/Cahier";
import Onboarding from "./views/Onboarding";

type Tab = "mecaniques" | "atelier" | "passage" | "generateurs" | "cahier";

const ONBOARD_KEY = "la-vanne:onboarded";

const TABS: { id: Tab; label: { fr: string; en: string }; emoji: string }[] = [
  { id: "mecaniques", label: { fr: "Mécaniques", en: "Mechanics" }, emoji: "⚙️" },
  { id: "atelier", label: { fr: "Atelier", en: "Workbench" }, emoji: "✍️" },
  { id: "passage", label: { fr: "Le passage", en: "Perform" }, emoji: "🎤" },
  { id: "generateurs", label: { fr: "Générateurs", en: "Generators" }, emoji: "💡" },
  { id: "cahier", label: { fr: "Cahier", en: "Notebook" }, emoji: "📓" },
];

export default function App() {
  const lang = useLang();
  const t = useT();
  const [tab, setTab] = useState<Tab>("mecaniques");
  const [onboard, setOnboard] = useState(() => {
    try {
      return localStorage.getItem(ONBOARD_KEY) !== "1";
    } catch {
      return true;
    }
  });

  function finishOnboard() {
    try {
      localStorage.setItem(ONBOARD_KEY, "1");
    } catch {
      /* ignore */
    }
    setOnboard(false);
  }

  return (
    <div className="stage-bg min-h-full">
      {onboard && <Onboarding onDone={finishOnboard} />}

      {/* curtain top + neon marquee header */}
      <div className="h-2 bg-velvet-curtain" />
      <header className="sticky top-0 z-40 backdrop-blur-md bg-night-deep/80 border-b border-velvet-dark/60">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setTab("mecaniques")}
            className="flex items-center gap-2 group"
            aria-label="La Vanne"
          >
            <span className="font-display text-2xl tracking-wide chrome-text">LA</span>
            <NeonSign text="VANNE" flicker className="text-3xl" />
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[0.7rem] uppercase tracking-widest text-cream/40">
              {t("l'atelier de la blague", "the joke workshop")}
            </span>
            <button
              onClick={toggleLang}
              className="chip border-amber-dim/50 text-amber hover:bg-amber/10"
              aria-label={t("Changer la langue", "Switch language")}
            >
              {lang === "fr" ? "FR" : "EN"} ⇄ {lang === "fr" ? "EN" : "FR"}
            </button>
          </div>
        </div>

        {/* tab bar */}
        <nav className="max-w-4xl mx-auto px-2 pb-2 flex gap-1 overflow-x-auto">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`btn whitespace-nowrap px-3.5 py-1.5 text-sm rounded-full transition-all ${
                tab === tb.id
                  ? "bg-amber-hot text-night-deep font-semibold shadow-spot-sm"
                  : "text-cream/70 hover:text-amber hover:bg-amber/5"
              }`}
            >
              <span aria-hidden>{tb.emoji}</span> {tb.label[lang]}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {tab === "mecaniques" && <Mecaniques />}
        {tab === "atelier" && <Atelier />}
        {tab === "passage" && <Passage />}
        {tab === "generateurs" && <Generateurs />}
        {tab === "cahier" && <Cahier />}
      </main>

      <footer className="border-t border-velvet-dark/50 py-6 text-center">
        <p className="text-xs text-cream/40">
          {t(
            "La Vanne · roaste la joke, jamais la personne · fait à l'Atelier",
            "La Vanne · roast the joke, never the person · made at the Atelier",
          )}
        </p>
      </footer>
    </div>
  );
}
