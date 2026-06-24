import { useState } from "react";
import { fetchNotes } from "../api";
import { saveBit } from "../db";
import { useLang, useT } from "../i18n";
import type { RoomNotes } from "../types";
import { PersonaDial, RoomLoading, Spotlight, Verdict } from "../ui";

const LOADING = {
  fr: ["La salle lit ton matériel…", "On dissèque la chute…", "On cherche le game…", "On écrit les notes…"],
  en: ["The room reads your bit…", "Dissecting the punchline…", "Finding the game…", "Writing notes…"],
};

function personaLabel(v: number, t: (fr: string, en: string) => string): string {
  if (v <= 20) return t("Animateur d'open-mic bienveillant", "Gentle open-mic host");
  if (v <= 50) return t("Éditeur de salle, juste mais franc", "Sharp, fair room editor");
  if (v <= 80) return t("Salle de fin de soirée, dure", "Tough late-night room");
  return t("Foule de 1h du matin, impitoyable", "Vicious 1am crowd");
}

export default function Atelier() {
  const lang = useLang();
  const t = useT();
  const [joke, setJoke] = useState("");
  const [persona, setPersona] = useState(40);
  const [notes, setNotes] = useState<RoomNotes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function run() {
    if (joke.trim().length < 8) {
      setError(t("Écris au moins un setup pis une chute.", "Write at least a setup and a punch."));
      return;
    }
    setError(null);
    setNotes(null);
    setSaved(false);
    setLoading(true);
    try {
      const r = await fetchNotes(joke, persona, lang);
      setNotes(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function saveRewrite(text: string) {
    await saveBit(text, "atelier", ["réécriture"], 0);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-wide text-cream">
          {t("L'ATELIER", "THE WORKBENCH")}
        </h2>
        <p className="text-cream/70 mt-2 max-w-xl mx-auto">
          {t(
            "Écris une joke. La salle te renvoie des notes : la surprise, le mot drôle, le game, 3 chutes de rechange, pis une réécriture serrée.",
            "Write a joke. The room sends back notes: the surprise, the funny word, the game, 3 alternate punchlines, and a tightened rewrite.",
          )}
        </p>
      </header>

      <div className="panel p-6 space-y-5">
        <textarea
          value={joke}
          onChange={(e) => setJoke(e.target.value)}
          rows={5}
          placeholder={t(
            "Ta joke ou ton bit ici… (setup + chute)",
            "Your joke or bit here… (setup + punch)",
          )}
          className="field font-body text-lg resize-y"
        />

        <div className="grid md:grid-cols-[1fr_auto] gap-5 items-end">
          <div>
            <PersonaDial
              value={persona}
              onChange={setPersona}
              labels={{
                left: t("Open-mic", "Open-mic"),
                right: t("Late-night", "Late-night"),
                title: personaLabel(persona, t),
              }}
            />
            <p className="text-xs text-cream/60 mt-2">{personaLabel(persona, t)}</p>
          </div>
          <button onClick={run} disabled={loading} className="btn-primary text-lg">
            🎤 {t("Passer au test", "Run the room")}
          </button>
        </div>

        {error && <p className="text-neon-red text-sm">{error}</p>}
      </div>

      {loading && (
        <div className="panel">
          <RoomLoading messages={lang === "fr" ? LOADING.fr : LOADING.en} />
        </div>
      )}

      {notes && !loading && (
        <div className="space-y-4 animate-riseIn">
          <Spotlight>
            <div className="panel-raise p-5 text-center">
              <span className="text-[0.65rem] uppercase tracking-widest text-amber/70">
                {t("Le verdict", "The verdict")}
              </span>
              <p className="font-display text-2xl text-cream mt-1">"{notes.verdict}"</p>
            </div>
          </Spotlight>

          <div className="grid md:grid-cols-2 gap-4">
            <NoteBox title={t("Où est la surprise", "Where the surprise is")} body={notes.surprise} />
            <div className="panel p-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Verdict
                  ok={notes.funnyWordLast.ok}
                  yes={t("Mot drôle en dernier", "Funny word last")}
                  no={t("Mot drôle enterré", "Funny word buried")}
                />
                <Verdict
                  ok={notes.setupLength.ok}
                  yes={t("Setup serré", "Setup tight")}
                  no={t("Setup trop long", "Setup too long")}
                />
              </div>
              <p className="text-sm text-cream/85">{notes.funnyWordLast.comment}</p>
              <p className="text-sm text-cream/85">{notes.setupLength.comment}</p>
            </div>
          </div>

          <NoteBox title={t("Le game", "The game")} body={notes.theGame} accent />

          <div className="panel p-5">
            <h3 className="neon-sign-cyan text-lg mb-3">
              {t("3 CHUTES DE RECHANGE", "3 ALTERNATE PUNCHLINES")}
            </h3>
            <ul className="space-y-2">
              {notes.altPunchlines.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-night-deep/60 border border-amber-dim/20 p-3"
                >
                  <span className="font-mono text-amber shrink-0">{i + 1}.</span>
                  <span className="text-cream/90 flex-1">{p}</span>
                  <button
                    onClick={() => saveBit(p, "atelier", ["chute"], 0)}
                    className="text-xs text-amber/70 hover:text-amber shrink-0"
                    title={t("Sauver dans le cahier", "Save to notebook")}
                  >
                    ★
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-raise p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="neon-sign text-lg">{t("LA RÉÉCRITURE", "THE REWRITE")}</h3>
              <button onClick={() => saveRewrite(notes.rewrite)} className="btn-ghost text-sm">
                {saved ? t("✓ Sauvé", "✓ Saved") : t("★ Sauver", "★ Save")}
              </button>
            </div>
            <p className="text-cream text-lg leading-relaxed whitespace-pre-wrap">{notes.rewrite}</p>
          </div>

          <div className="rounded-2xl border border-dashed border-amber/40 p-4 bg-night-panel/40">
            <span className="text-[0.65rem] uppercase tracking-widest text-amber/70">
              {t("Une de plus", "One more")}
            </span>
            <p className="text-cream/90 mt-1">{notes.oneMore}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteBox({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div className={`panel p-5 ${accent ? "border-amber/40" : ""}`}>
      <span className={`text-[0.65rem] uppercase tracking-widest ${accent ? "text-amber" : "text-cream/50"}`}>
        {title}
      </span>
      <p className="text-cream/90 mt-1 leading-relaxed">{body}</p>
    </div>
  );
}
