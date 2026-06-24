import { useEffect, useRef, useState } from "react";
import { dealPremise, fetchHeckle, fetchRoomRead, type HeckleHistory } from "../api";
import { saveBit } from "../db";
import { useLang, useT } from "../i18n";
import type { RoomRead } from "../types";
import { EnergyMeter, Mic, NeonSign, PersonaDial, Spotlight } from "../ui";
import { useSpeech } from "../useSpeech";

type Phase = "idle" | "ready" | "live" | "done";

interface Line {
  role: "comic" | "room";
  text: string;
  energy?: number;
}

const PERFORM_SECONDS = 60;

function personaLabel(v: number, t: (fr: string, en: string) => string): string {
  if (v <= 20) return t("Salle douce", "Soft room");
  if (v <= 50) return t("Salle correcte", "Decent room");
  if (v <= 80) return t("Salle dure", "Tough room");
  return t("Salle impitoyable", "Brutal room");
}

export default function Passage() {
  const lang = useLang();
  const t = useT();
  const [phase, setPhase] = useState<Phase>("idle");
  const [persona, setPersona] = useState(65);
  const [premise, setPremise] = useState("");
  const [firstLine, setFirstLine] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [draft, setDraft] = useState("");
  const [energy, setEnergy] = useState(50);
  const [seconds, setSeconds] = useState(PERFORM_SECONDS);
  const [busy, setBusy] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [read, setRead] = useState<RoomRead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const speech = useSpeech(lang);

  // append dictated speech to the draft
  useEffect(() => {
    if (speech.transcript) setDraft((d) => (d ? d + " " : "") + speech.transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  async function deal() {
    setDealing(true);
    setError(null);
    try {
      const r = await dealPremise(lang);
      setPremise(r.premise);
      setFirstLine(r.firstLine);
      setPhase("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setDealing(false);
    }
  }

  function startClock() {
    setPhase("live");
    setSeconds(PERFORM_SECONDS);
    setLines([]);
    setRead(null);
    setEnergy(50);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function stopClock() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  async function sendLine() {
    const text = draft.trim();
    if (!text || busy) return;
    if (speech.listening) speech.stop();
    setDraft("");
    const next: Line[] = [...lines, { role: "comic", text }];
    setLines(next);
    setBusy(true);
    try {
      const history: HeckleHistory[] = next.map((l) => ({
        role: l.role,
        text: l.text,
      }));
      const turn = await fetchHeckle(premise, history, text, persona, lang);
      setLines((cur) => [...cur, { role: "room", text: turn.heckle, energy: turn.energy }]);
      setEnergy(turn.energy);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    stopClock();
    if (speech.listening) speech.stop();
    setPhase("done");
    if (lines.filter((l) => l.role === "comic").length === 0) return;
    setBusy(true);
    try {
      const history: HeckleHistory[] = lines.map((l) => ({ role: l.role, text: l.text }));
      const r = await fetchRoomRead(premise, history, persona, lang);
      setRead(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    stopClock();
    setPhase("idle");
    setPremise("");
    setFirstLine("");
    setLines([]);
    setDraft("");
    setRead(null);
    setError(null);
    setEnergy(50);
  }

  async function saveSet() {
    const set = lines
      .filter((l) => l.role === "comic")
      .map((l) => l.text)
      .join("\n");
    if (set) await saveBit(`[${premise}]\n\n${set}`, "passage", ["set"], 0);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const lowTime = seconds <= 10;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-wide text-cream">
          {t("LE PASSAGE", "PERFORM MODE")}
        </h2>
        <p className="text-cream/70 mt-2 max-w-xl mx-auto">
          {t(
            "60 secondes, une prémisse, pis une salle qui réagit en direct. Tape ou dicte tes lignes.",
            "60 seconds, one premise, and a room that reacts live. Type or dictate your lines.",
          )}
        </p>
      </header>

      {/* IDLE — pick the room, deal a premise */}
      {phase === "idle" && (
        <div className="panel p-6 space-y-5">
          <PersonaDial
            value={persona}
            onChange={setPersona}
            labels={{
              left: t("Douce", "Soft"),
              right: t("Impitoyable", "Brutal"),
              title: personaLabel(persona, t),
            }}
          />
          <p className="text-xs text-cream/60">{personaLabel(persona, t)}</p>
          <button onClick={deal} disabled={dealing} className="btn-primary w-full text-lg">
            {dealing ? t("On brasse les cartes…", "Shuffling…") : t("🃏 Donne-moi une prémisse", "🃏 Deal me a premise")}
          </button>
          {error && <p className="text-neon-red text-sm">{error}</p>}
        </div>
      )}

      {/* READY — show premise + first line, start the clock */}
      {phase === "ready" && (
        <Spotlight>
          <div className="panel-raise p-6 space-y-4 text-center">
            <span className="text-[0.65rem] uppercase tracking-widest text-amber/70">
              {t("Ta prémisse", "Your premise")}
            </span>
            <p className="font-display text-2xl text-amber">{premise}</p>
            {firstLine && (
              <p className="text-cream/70 italic">
                {t("Première ligne possible :", "Possible first line:")} « {firstLine} »
              </p>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={startClock} className="btn-primary text-lg">
                ⏱ {t("Démarrer les 60 sec", "Start the 60 sec")}
              </button>
              <button onClick={deal} disabled={dealing} className="btn-ghost">
                {t("Autre prémisse", "Another premise")}
              </button>
            </div>
          </div>
        </Spotlight>
      )}

      {/* LIVE — the clock, the room, the input */}
      {(phase === "live" || phase === "done") && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-[auto_1fr] gap-4 items-center">
            <div
              className={`panel-raise px-6 py-3 text-center ${lowTime && phase === "live" ? "animate-buzz" : ""}`}
            >
              <span className="text-[0.6rem] uppercase tracking-widest text-cream/50 block">
                {t("Temps", "Time")}
              </span>
              <span
                className={`font-mono text-4xl font-bold ${lowTime ? "text-neon-red" : "text-amber"}`}
              >
                {mm}:{ss}
              </span>
            </div>
            <div className="panel p-4">
              <EnergyMeter value={energy} label={t("Énergie de la salle", "Room energy")} />
              <p className="text-xs text-amber/70 mt-2 truncate">
                {t("Prémisse :", "Premise:")} {premise}
              </p>
            </div>
          </div>

          {/* the room transcript */}
          <div ref={scrollRef} className="panel p-4 h-72 overflow-y-auto space-y-3">
            {lines.length === 0 && phase === "live" && (
              <p className="text-cream/50 text-center py-10">
                {t("Lance ta première ligne…", "Drop your first line…")}
              </p>
            )}
            {lines.map((l, i) =>
              l.role === "comic" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-amber/15 border border-amber/30 px-4 py-2">
                    <span className="text-[0.6rem] uppercase tracking-widest text-amber/70 block">
                      {t("Toi", "You")}
                    </span>
                    <p className="text-cream">{l.text}</p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-velvet-dark/40 border border-neon-red/30 px-4 py-2">
                    <span className="text-[0.6rem] uppercase tracking-widest text-neon-red/80 block">
                      {t("La salle", "The room")}
                    </span>
                    <p className="text-cream/90 italic">{l.text}</p>
                  </div>
                </div>
              ),
            )}
            {busy && phase === "live" && (
              <p className="text-cream/50 text-sm text-center animate-pulse2">
                {t("…la salle réagit", "…the room reacts")}
              </p>
            )}
          </div>

          {phase === "live" && (
            <div className="panel p-4 space-y-3">
              <div className="flex gap-2 items-end">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendLine();
                    }
                  }}
                  rows={2}
                  placeholder={t("Ta prochaine ligne… (Entrée = envoyer)", "Your next line… (Enter = send)")}
                  className="field resize-none flex-1"
                />
                {speech.supported && (
                  <button
                    onClick={() => (speech.listening ? speech.stop() : speech.start())}
                    className={`btn shrink-0 px-4 py-3 rounded-xl border ${
                      speech.listening
                        ? "bg-neon-red/20 border-neon-red text-neon-red animate-pulse2"
                        : "border-amber-dim/50 text-amber hover:bg-amber/10"
                    }`}
                    title={t("Dictée vocale", "Voice dictation")}
                  >
                    {speech.listening ? "● REC" : "🎙"}
                  </button>
                )}
              </div>
              <div className="flex gap-2 justify-between">
                <button onClick={finish} className="btn-ghost text-sm">
                  {t("Terminer", "End set")}
                </button>
                <button onClick={sendLine} disabled={busy || !draft.trim()} className="btn-primary">
                  {t("Envoyer", "Send")} →
                </button>
              </div>
              {!speech.supported && (
                <p className="text-[0.7rem] text-cream/40">
                  {t(
                    "La dictée vocale n'est pas dispo sur ce navigateur — tape tes lignes.",
                    "Voice dictation isn't available in this browser — type your lines.",
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* DONE — the room read */}
      {phase === "done" && (
        <div className="space-y-4 animate-riseIn">
          {busy && !read && (
            <div className="panel p-6 text-center">
              <NeonSign text="LA SALLE DÉLIBÈRE" flicker className="text-2xl" />
            </div>
          )}
          {read && (
            <>
              <Spotlight>
                <div className="panel-raise p-6 text-center space-y-3">
                  <span className="text-[0.65rem] uppercase tracking-widest text-amber/70">
                    {t("La lecture de la salle", "The room read")}
                  </span>
                  <div className="flex items-center justify-center gap-4">
                    <Mic className="h-20 w-auto" />
                    <div className="text-left">
                      <div className="font-mono text-6xl font-bold text-amber">{read.score}</div>
                      <span className="text-xs text-cream/50">/ 100</span>
                    </div>
                  </div>
                  <p className="text-xs text-cream/50 italic max-w-md mx-auto">
                    {t(
                      "Un chiffre, c'est UNE salle, un soir. La comédie est subjective.",
                      "A number is ONE room, one night. Comedy is subjective.",
                    )}
                  </p>
                  <p className="text-cream text-lg leading-relaxed">{read.read}</p>
                </div>
              </Spotlight>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="panel p-5">
                  <span className="neon-sign-cyan text-sm">{t("LE MEILLEUR MOMENT", "BEST MOMENT")}</span>
                  <p className="text-cream/90 mt-2">{read.highlight}</p>
                </div>
                <div className="panel p-5">
                  <span className="text-amber text-sm uppercase tracking-widest">
                    {t("À retravailler", "Take home")}
                  </span>
                  <p className="text-cream/90 mt-2">{read.note}</p>
                </div>
              </div>
            </>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={saveSet} className="btn-ghost">
              ★ {t("Sauver ce set", "Save this set")}
            </button>
            <button onClick={reset} className="btn-primary">
              {t("Remonter sur scène", "Back on stage")}
            </button>
          </div>
          {error && <p className="text-neon-red text-sm text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
