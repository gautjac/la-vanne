import { useState } from "react";
import { LESSONS, type Lesson } from "../lessons";
import { useLang, useT } from "../i18n";
import { Spotlight } from "../ui";

function LessonCard({ lesson, onOpen }: { lesson: Lesson; onOpen: () => void }) {
  const lang = useLang();
  return (
    <button
      onClick={onOpen}
      className="panel text-left p-5 hover:border-amber/60 hover:-translate-y-1 transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none">{lesson.emoji}</span>
        <div>
          <h3 className="font-display text-xl tracking-wide text-cream group-hover:text-amber transition-colors">
            {lesson.title[lang].toUpperCase()}
          </h3>
          <p className="text-sm text-amber/80 mt-1">{lesson.oneLiner[lang]}</p>
        </div>
      </div>
    </button>
  );
}

function LessonDetail({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const lang = useLang();
  const t = useT();
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-6 animate-riseIn">
      <button onClick={onClose} className="btn-ghost text-sm">
        ← {t("Toutes les mécaniques", "All mechanics")}
      </button>

      <Spotlight>
        <header className="text-center pt-6">
          <div className="text-5xl mb-2">{lesson.emoji}</div>
          <h2 className="font-display text-4xl md:text-5xl tracking-wide text-amber">
            {lesson.title[lang].toUpperCase()}
          </h2>
          <p className="text-lg text-cream/80 mt-2 italic">{lesson.oneLiner[lang]}</p>
        </header>
      </Spotlight>

      <div className="panel p-6 space-y-4">
        {lesson.body[lang].map((p, i) => (
          <p key={i} className="text-cream/90 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {/* The worked example — dissect it */}
      <div className="panel-raise p-6">
        <h3 className="neon-sign-cyan text-xl mb-4">{t("L'EXEMPLE — À DISSÉQUER", "THE EXAMPLE — DISSECT IT")}</h3>
        <div className="space-y-3">
          <div className="rounded-xl bg-night-deep/70 border border-amber-dim/20 p-4">
            <span className="text-[0.65rem] uppercase tracking-widest text-cream/50">
              {t("Setup", "Setup")}
            </span>
            <p className="text-cream/90 mt-1">{lesson.example.setup[lang]}</p>
          </div>
          <div className="rounded-xl bg-velvet-dark/30 border border-neon-red/30 p-4">
            <span className="text-[0.65rem] uppercase tracking-widest text-neon-red/80">
              {t("Chute", "Punchline")}
            </span>
            <p className="text-cream font-semibold mt-1">{lesson.example.punch[lang]}</p>
          </div>
        </div>

        <button
          onClick={() => setRevealed((r) => !r)}
          className="btn-ghost text-sm mt-4"
          aria-expanded={revealed}
        >
          {revealed ? t("Cacher l'analyse", "Hide the breakdown") : t("Pourquoi ça marche ?", "Why does it work?")}
        </button>
        {revealed && (
          <div className="mt-4 rounded-xl bg-amber/5 border border-amber/30 p-4 animate-riseIn">
            <span className="text-[0.65rem] uppercase tracking-widest text-amber/80">
              {t("La mécanique", "The mechanic")}
            </span>
            <p className="text-cream/90 mt-1 leading-relaxed">{lesson.example.why[lang]}</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-amber/40 p-5 text-center bg-night-panel/50">
        <span className="text-[0.65rem] uppercase tracking-widest text-amber/70">
          {t("À toi", "Your turn")}
        </span>
        <p className="text-cream/90 mt-1">{lesson.tryThis[lang]}</p>
      </div>
    </div>
  );
}

export default function Mecaniques() {
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);
  const lesson = LESSONS.find((l) => l.id === open) ?? null;

  if (lesson) return <LessonDetail lesson={lesson} onClose={() => setOpen(null)} />;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-wide text-cream">
          {t("LES MÉCANIQUES", "THE MECHANICS")}
        </h2>
        <p className="text-cream/70 mt-2 max-w-xl mx-auto">
          {t(
            "La vraie machinerie du drôle. Onze leçons courtes, chacune avec un exemple à disséquer.",
            "The real machinery of funny. Eleven short lessons, each with an example to take apart.",
          )}
        </p>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        {LESSONS.map((l) => (
          <LessonCard key={l.id} lesson={l} onOpen={() => setOpen(l.id)} />
        ))}
      </div>
    </div>
  );
}
