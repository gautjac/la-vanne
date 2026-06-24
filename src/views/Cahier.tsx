import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { bitsToMarkdown, db, deleteBit, saveBit, updateBit } from "../db";
import { useT } from "../i18n";
import type { Bit } from "../types";

function Stars({ value, onSet }: { value: number; onSet: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onSet(n === value ? 0 : n)}
          className={`text-lg leading-none transition ${
            n <= value ? "text-amber" : "text-cream/25 hover:text-amber/50"
          }`}
          aria-label={`${n}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Cahier() {
  const t = useT();
  const bits = useLiveQuery(() => db.bits.orderBy("updatedAt").reverse().toArray(), []) ?? [];
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editTags, setEditTags] = useState("");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    bits.forEach((b) => b.tags.forEach((tg) => s.add(tg)));
    return [...s].sort();
  }, [bits]);

  const shown = bits.filter(
    (b) => (!filterTag || b.tags.includes(filterTag)) && b.rating >= minRating,
  );

  async function addNew() {
    if (newText.trim().length < 2) return;
    await saveBit(newText, "manuel", [], 0);
    setNewText("");
  }

  function startEdit(b: Bit) {
    setEditing(b.id!);
    setEditText(b.text);
    setEditTags(b.tags.join(", "));
  }

  async function saveEdit(id: number) {
    const tags = editTags
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    await updateBit(id, { text: editText.trim(), tags });
    setEditing(null);
  }

  function exportMd() {
    const md = bitsToMarkdown(shown);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mon-cahier-la-vanne-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-wide text-cream">
          {t("MON CAHIER", "MY NOTEBOOK")}
        </h2>
        <p className="text-cream/70 mt-2 max-w-xl mx-auto">
          {t(
            "Tes bits sauvegardés. Note-les, tague-les, filtre, exporte en Markdown.",
            "Your saved bits. Rate them, tag them, filter, export to Markdown.",
          )}
        </p>
      </header>

      <div className="panel p-5 space-y-3">
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={2}
          placeholder={t("Note une joke vite faite…", "Jot a quick joke…")}
          className="field resize-none"
        />
        <div className="flex justify-end">
          <button onClick={addNew} className="btn-primary text-sm">
            + {t("Ajouter", "Add")}
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-cream/50">
          {t("Filtres", "Filters")}
        </span>
        <button
          onClick={() => setFilterTag(null)}
          className={`chip ${!filterTag ? "border-amber text-amber" : "border-cream/20 text-cream/60"}`}
        >
          {t("Tous", "All")}
        </button>
        {allTags.map((tg) => (
          <button
            key={tg}
            onClick={() => setFilterTag(tg === filterTag ? null : tg)}
            className={`chip ${filterTag === tg ? "border-amber text-amber" : "border-cream/20 text-cream/60"}`}
          >
            #{tg}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-2 text-xs text-cream/50">
          {t("Note min", "Min rating")}
          <Stars value={minRating} onSet={setMinRating} />
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-cream/60">
          {shown.length} {t("bit(s)", "bit(s)")}
        </span>
        <button onClick={exportMd} disabled={shown.length === 0} className="btn-ghost text-sm">
          ⬇ {t("Exporter en Markdown", "Export Markdown")}
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="panel p-10 text-center text-cream/50">
          {t(
            "Rien encore. Sauve des chutes depuis l'Atelier ou les Générateurs (★).",
            "Nothing yet. Save punchlines from the Workbench or Generators (★).",
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {shown.map((b) => (
            <div key={b.id} className="panel p-4 space-y-3 flex flex-col">
              {editing === b.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="field resize-y text-sm"
                  />
                  <input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder={t("tags, séparés, par, virgules", "tags, comma, separated")}
                    className="field text-sm py-2"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(null)} className="btn-ghost text-xs">
                      {t("Annuler", "Cancel")}
                    </button>
                    <button onClick={() => saveEdit(b.id!)} className="btn-primary text-xs">
                      {t("Sauver", "Save")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-cream/90 whitespace-pre-wrap flex-1">{b.text}</p>
                  <div className="flex flex-wrap gap-1">
                    {b.tags.map((tg) => (
                      <span key={tg} className="chip border-velvet/50 text-amber/70 text-[0.65rem]">
                        #{tg}
                      </span>
                    ))}
                    <span className="chip border-cream/15 text-cream/40 text-[0.65rem]">{b.source}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Stars value={b.rating} onSet={(n) => updateBit(b.id!, { rating: n })} />
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(b)}
                        className="text-xs text-cream/50 hover:text-amber"
                      >
                        {t("Éditer", "Edit")}
                      </button>
                      <button
                        onClick={() => deleteBit(b.id!)}
                        className="text-xs text-cream/50 hover:text-neon-red"
                      >
                        {t("Suppr.", "Delete")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
