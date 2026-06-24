import { useEffect, useState } from "react";

// ── The chrome mic on a stand (SVG) ─────────────────────────────────────────
export function Mic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 140" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="chrome-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a8e95" />
          <stop offset="0.45" stopColor="#eef0f3" />
          <stop offset="0.55" stopColor="#c9ccd1" />
          <stop offset="1" stopColor="#6b6f75" />
        </linearGradient>
      </defs>
      {/* head */}
      <ellipse cx="32" cy="26" rx="18" ry="22" fill="url(#chrome-g)" />
      <g stroke="#3a3d42" strokeWidth="1" opacity="0.6">
        <line x1="18" y1="18" x2="46" y2="18" />
        <line x1="16" y1="26" x2="48" y2="26" />
        <line x1="18" y1="34" x2="46" y2="34" />
        <line x1="26" y1="8" x2="26" y2="44" />
        <line x1="32" y1="6" x2="32" y2="46" />
        <line x1="38" y1="8" x2="38" y2="44" />
      </g>
      {/* neck */}
      <rect x="28" y="46" width="8" height="14" rx="3" fill="url(#chrome-g)" />
      {/* stand */}
      <rect x="30" y="58" width="4" height="62" fill="url(#chrome-g)" />
      <ellipse cx="32" cy="124" rx="22" ry="6" fill="url(#chrome-g)" />
      <ellipse cx="32" cy="122" rx="22" ry="5" fill="#1c0c0f" opacity="0.4" />
    </svg>
  );
}

// ── Neon sign ────────────────────────────────────────────────────────────────
export function NeonSign({
  text,
  color = "red",
  className = "",
  flicker = false,
}: {
  text: string;
  color?: "red" | "cyan";
  className?: string;
  flicker?: boolean;
}) {
  return (
    <span
      className={`${color === "cyan" ? "neon-sign-cyan" : "neon-sign"} ${
        flicker ? "animate-flicker" : ""
      } ${className}`}
    >
      {text}
    </span>
  );
}

// ── Spotlight glow wrapper ───────────────────────────────────────────────────
export function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-44 w-[80%] max-w-2xl animate-spotSway"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,230,160,0.20), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// ── Persona dial: gentle open-mic ↔ vicious late-night ──────────────────────
export function PersonaDial({
  value,
  onChange,
  labels,
}: {
  value: number;
  onChange: (v: number) => void;
  labels: { left: string; right: string; title: string };
}) {
  const tier =
    value <= 20 ? labels.title : value <= 50 ? labels.title : value <= 80 ? labels.title : labels.title;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider">
        <span className="text-amber/80">{labels.left}</span>
        <span className="text-neon-red font-bold">{labels.right}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vanne-range w-full"
        aria-label={tier}
      />
      <style>{`
        .vanne-range { -webkit-appearance:none; appearance:none; height:6px; border-radius:9999px;
          background: linear-gradient(90deg, #e8c45a 0%, #f4b73a 40%, #ff2d3f 100%); outline:none; }
        .vanne-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:22px; height:22px;
          border-radius:9999px; background: radial-gradient(circle at 35% 30%, #eef0f3, #8a8e95);
          border:2px solid #120608; cursor:pointer; box-shadow:0 0 10px rgba(255,45,63,0.6); }
        .vanne-range::-moz-range-thumb { width:22px; height:22px; border-radius:9999px;
          background: radial-gradient(circle at 35% 30%, #eef0f3, #8a8e95); border:2px solid #120608;
          cursor:pointer; box-shadow:0 0 10px rgba(255,45,63,0.6); }
      `}</style>
    </div>
  );
}

// ── Energy meter (le passage) ───────────────────────────────────────────────
export function EnergyMeter({ value, label }: { value: number; label: string }) {
  const color = value >= 70 ? "#2ee6e6" : value >= 40 ? "#f4b73a" : "#ff2d3f";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-cream/60">
        <span>{label}</span>
        <span className="font-mono" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-night-deep overflow-hidden border border-velvet-dark/50">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}

// ── Loading: a blinking ON-AIR sign ──────────────────────────────────────────
export function RoomLoading({ messages }: { messages: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (messages.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % messages.length), 1800);
    return () => clearInterval(id);
  }, [messages.length]);
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="relative">
        <NeonSign text="EN ONDES" flicker className="text-2xl" />
      </div>
      <p className="text-sm text-cream/70 animate-pulse2">{messages[i] ?? messages[0]}</p>
    </div>
  );
}

// ── Verdict badge (ok / not ok) ──────────────────────────────────────────────
export function Verdict({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return (
    <span
      className={`chip ${
        ok
          ? "border-neon-cyan/60 text-neon-cyan bg-neon-cyan/5"
          : "border-neon-red/60 text-neon-red bg-neon-red/5"
      }`}
    >
      {ok ? "✓" : "✕"} {ok ? yes : no}
    </span>
  );
}
