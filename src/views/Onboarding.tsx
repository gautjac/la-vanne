import { useState } from "react";
import { useLang, useT } from "../i18n";
import { Mic, NeonSign, Spotlight } from "../ui";

const STEPS = [
  {
    sign: { fr: "EN ONDES", en: "ON AIR" },
    title: { fr: "Bienvenue à La Vanne", en: "Welcome to La Vanne" },
    body: {
      fr: "L'atelier de la blague. On apprend la mécanique du drôle — pis on te met devant une vraie salle.",
      en: "The joke workshop. Learn the machinery of funny — then face a real room.",
    },
  },
  {
    sign: { fr: "LES MÉCANIQUES", en: "THE MECHANICS" },
    title: { fr: "Apprends, écris, performe", en: "Learn, write, perform" },
    body: {
      fr: "Onze leçons avec exemples · un atelier où la salle dissèque ta joke · le passage : 60 secondes en direct.",
      en: "Eleven lessons with examples · a workbench where the room dissects your joke · perform mode: 60 live seconds.",
    },
  },
  {
    sign: { fr: "APPLAUDISSEZ", en: "APPLAUSE" },
    title: { fr: "La salle est honnête", en: "The room is honest" },
    body: {
      fr: "Tourne le bouton de douceur à impitoyable. On roast la JOKE, jamais la personne. Un score = une salle, un soir.",
      en: "Turn the dial from gentle to brutal. We roast the JOKE, never the person. A score = one room, one night.",
    },
  },
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const lang = useLang();
  const t = useT();
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 stage-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8 animate-riseIn">
        <Spotlight>
          <div className="pt-4">
            <Mic className="h-28 w-auto mx-auto mb-4" />
            <NeonSign text={s.sign[lang]} flicker className="text-2xl" />
          </div>
        </Spotlight>
        <div className="space-y-3">
          <h1 className="font-display text-4xl tracking-wide text-amber">{s.title[lang]}</h1>
          <p className="text-cream/85 text-lg leading-relaxed">{s.body[lang]}</p>
        </div>

        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-amber" : "w-2 bg-cream/25"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={onDone} className="btn-ghost text-sm">
            {t("Passer", "Skip")}
          </button>
          {last ? (
            <button onClick={onDone} className="btn-primary">
              {t("Monter sur scène 🎤", "Take the stage 🎤")}
            </button>
          ) : (
            <button onClick={() => setStep((n) => n + 1)} className="btn-primary">
              {t("Suivant", "Next")} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
