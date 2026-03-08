import { useState, useMemo } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap";

const SETUPS = {
  GAP_GO: {
    id: "GAP_GO", name: "GAP & GO", emoji: "🚀", direction: "long", color: "#00e676",
    criteria: [
      { id: "tape_loco",    label: "Tape loco 🔥",                     pts: 20, type: "pos", group: "core" },
      { id: "rompe_pmh",    label: "Rompe Pre Market High",              pts: 20, type: "pos", group: "core" },
      { id: "vol_hist",     label: "Volumen histórico",                  pts: 15, type: "pos", group: "core" },
      { id: "noticias",     label: "Catalizador / Noticias",             pts: 15, type: "pos", group: "core" },
      { id: "acumula_pmh",  label: "Acumula zona PMH antes de romper",   pts: 15, type: "pos", group: "core" },
      { id: "extension_ok", label: "Extensión 50%–150%",                 pts: 15, type: "pos", group: "core" },
      { id: "mercado_ok",   label: "Entorno mercado favorable",          pts: 10, type: "pos", group: "quality" },
      { id: "timing_ok",    label: "Timing 9:30–11h ⏰",                  pts: 10, type: "pos", group: "quality" },
      { id: "microfloat",   label: "Microfloat",                         pts:  7, type: "pos", group: "quality" },
      { id: "dilucion",     label: "Dilución activa ⚠️",                 pts: 25, type: "neg", group: "risk" },
      { id: "overhead",     label: "Overhead significativo",             pts: 15, type: "neg", group: "risk" },
      { id: "china",        label: "Stock chino 🇨🇳",                    pts:  8, type: "neg", group: "risk" },
    ],
  },
  BO_LONG: {
    id: "BO_LONG", name: "BREAKOUT LONG", emoji: "📈", direction: "long", color: "#69f0ae",
    criteria: [
      { id: "rompe_high",  label: "Rompe High previo",                   pts: 20, type: "pos", group: "core" },
      { id: "vol_hist",    label: "Volumen histórico",                    pts: 15, type: "pos", group: "core" },
      { id: "noticias",    label: "Catalizador / Noticias",               pts: 15, type: "pos", group: "core" },
      { id: "acumula_pmh", label: "Acumula zona PMH antes de romper",     pts: 15, type: "pos", group: "core" },
      { id: "tape_loco",   label: "Tape loco 🔥",                         pts: 20, type: "pos", group: "core" },
      { id: "mercado_ok",  label: "Entorno mercado favorable",            pts: 10, type: "pos", group: "quality" },
      { id: "microfloat",  label: "Microfloat",                           pts:  7, type: "pos", group: "quality" },
      { id: "dilucion",    label: "Dilución activa ⚠️",                   pts: 25, type: "neg", group: "risk" },
      { id: "overhead",    label: "Overhead significativo",               pts: 15, type: "neg", group: "risk" },
      { id: "china",       label: "Stock chino 🇨🇳",                      pts:  8, type: "neg", group: "risk" },
    ],
  },
  GAP_EXT_SHORT: {
    id: "GAP_EXT_SHORT", name: "GAP & EXT SHORT", emoji: "📉", direction: "short", color: "#ff5252",
    criteria: [
      { id: "ext_70",      label: "Extensión > 70%",                     pts: 20, type: "pos", group: "core" },
      { id: "vol_ext",     label: "Volumen alto en extensión",            pts: 15, type: "pos", group: "core" },
      { id: "destruye_pm", label: "Se destruye progresivamente pre-open", pts: 20, type: "pos", group: "core" },
      { id: "vol_decrec",  label: "Volumen decreciente en destrucción",   pts: 15, type: "pos", group: "core" },
      { id: "bajo_vwap",   label: "Stock bajo VWAP",                      pts: 20, type: "pos", group: "core" },
      { id: "mercado_ok",  label: "Entorno mercado favorable",            pts: 10, type: "pos", group: "quality" },
      { id: "zonas_agreg", label: "Zonas claras para agregar",            pts: 10, type: "pos", group: "quality" },
      { id: "dilucion",    label: "Dilución activa ✅",                   pts: 15, type: "pos", group: "quality" },
      { id: "overhead",    label: "Overhead significativo ✅",            pts: 10, type: "pos", group: "quality" },
      { id: "china",       label: "Stock chino ✅",                       pts: 10, type: "pos", group: "quality" },
      { id: "microfloat",  label: "Microfloat ✅",                        pts:  5, type: "pos", group: "quality" },
    ],
  },
  GAP_CRAP: {
    id: "GAP_CRAP", name: "GAP & CRAP", emoji: "💩", direction: "short", color: "#ff6d00",
    criteria: [
      { id: "ext_70",            label: "Extensión > 70–80%",            pts: 20, type: "pos", group: "core" },
      { id: "rompe_pmh_g2r",     label: "Rompe PMH antes del G2R",       pts: 15, type: "pos", group: "core" },
      { id: "rompe_vwap",        label: "Rompe zona relevante / VWAP",   pts: 20, type: "pos", group: "core" },
      { id: "vol_decrec_bounce", label: "Vol decreciente en bounce R2G", pts: 15, type: "pos", group: "core" },
      { id: "mercado_ok",        label: "Entorno mercado favorable",     pts: 10, type: "pos", group: "quality" },
      { id: "resist_tf",         label: "BO coincide resist. TF mayor",  pts: 10, type: "pos", group: "quality" },
      { id: "dilucion",          label: "Dilución activa ✅",             pts: 15, type: "pos", group: "quality" },
      { id: "overhead",          label: "Overhead significativo ✅",      pts: 10, type: "pos", group: "quality" },
      { id: "china",             label: "Stock chino ✅",                 pts: 10, type: "pos", group: "quality" },
      { id: "microfloat",        label: "Microfloat ✅",                  pts:  5, type: "pos", group: "quality" },
    ],
  },
  SHORT_RESIST: {
    id: "SHORT_RESIST", name: "SHORT INTO RESIST.", emoji: "🧱", direction: "short", color: "#e040fb",
    criteria: [
      { id: "ext_80",        label: "Extensión > 80%",                   pts: 20, type: "pos", group: "core" },
      { id: "rompe_highs",   label: "Rompiendo highs previos",           pts: 15, type: "pos", group: "core" },
      { id: "zona_tf_mayor", label: "Precio en resistencia TF mayor",    pts: 20, type: "pos", group: "core" },
      { id: "ext_tramo",     label: "Extensión clara del tramo",         pts: 15, type: "pos", group: "core" },
      { id: "vol_relevante", label: "Día extensión con vol relevante",   pts: 15, type: "pos", group: "core" },
      { id: "mercado_ok",    label: "Entorno mercado favorable",         pts: 10, type: "pos", group: "quality" },
      { id: "overhead",      label: "Overhead significativo ✅",          pts: 10, type: "pos", group: "quality" },
      { id: "china",         label: "Stock chino ✅",                     pts: 10, type: "pos", group: "quality" },
      { id: "microfloat",    label: "Microfloat ✅",                      pts:  5, type: "pos", group: "quality" },
    ],
  },
  FBO: {
    id: "FBO", name: "FBO", emoji: "🪤", direction: "short", color: "#ffab40",
    criteria: [
      { id: "timing_fbo",      label: "Timing 9:30–10:30h ⏰",           pts: 15, type: "pos", group: "core" },
      { id: "break_pmh",       label: "Break inicial del PMH",           pts: 15, type: "pos", group: "core" },
      { id: "break_violencia", label: "Break inicial con violencia",     pts: 15, type: "pos", group: "core" },
      { id: "break_vol",       label: "Break inicial con mucho volumen", pts: 15, type: "pos", group: "core" },
      { id: "fail_rapido",     label: "Fail rápido (3–4 min)",           pts: 15, type: "pos", group: "core" },
      { id: "fail_violencia",  label: "Fail con violencia / intención",  pts: 15, type: "pos", group: "core" },
      { id: "no_guarrea",      label: "No 'guarrea' en PMH",             pts: 10, type: "pos", group: "core" },
      { id: "breakdown_claro", label: "Breakdown claro bajo PMH",        pts: 15, type: "pos", group: "core" },
      { id: "rompe_zona",      label: "Rompe zona relevante a la baja",  pts: 10, type: "pos", group: "quality" },
      { id: "rompe_vwap",      label: "Rompe VWAP a la baja",            pts: 10, type: "pos", group: "quality" },
      { id: "fbo_resist_tf",   label: "FBO coincide resist. TF mayor",   pts: 10, type: "pos", group: "quality" },
      { id: "mercado_ok",      label: "Entorno mercado favorable",       pts: 10, type: "pos", group: "quality" },
      { id: "overhead",        label: "Overhead significativo ✅",        pts: 10, type: "pos", group: "quality" },
      { id: "china",           label: "Stock chino ✅",                   pts:  8, type: "pos", group: "quality" },
      { id: "microfloat",      label: "Microfloat ✅",                    pts:  5, type: "pos", group: "quality" },
    ],
  },
};

const GRADES = [
  { grade: "A+", min: 78, riskPct: 0.50, color: "#00e676", bg: "rgba(0,230,118,0.1)" },
  { grade: "A",  min: 62, riskPct: 0.30, color: "#69f0ae", bg: "rgba(105,240,174,0.08)" },
  { grade: "B",  min: 46, riskPct: 0.15, color: "#ffab40", bg: "rgba(255,171,64,0.08)" },
  { grade: "C",  min: 30, riskPct: 0.07, color: "#ff8a65", bg: "rgba(255,138,101,0.08)" },
  { grade: "✕",  min:  0, riskPct: 0.00, color: "#ef5350", bg: "rgba(239,83,80,0.08)" },
];

function getGrade(score) { return GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1]; }
function fmt$(n) { if (!n && n !== 0) return "–"; return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtN(n) { if (!n && n !== 0) return "–"; return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

function ScoreBar({ score, color, height = 5 }) {
  return (
    <div style={{ width: "100%", height, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, score))}%`, background: color, borderRadius: 3, transition: "width 0.35s ease", boxShadow: `0 0 8px ${color}60` }} />
    </div>
  );
}

function Lbl({ children }) {
  return <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 4 }}>{children}</div>;
}

function NumInput({ label, value, onChange, prefix, placeholder }) {
  return (
    <div style={{ flex: 1 }}>
      {label && <Lbl>{label}</Lbl>}
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", pointerEvents: "none" }}>{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""}
          style={{ width: "100%", padding: "9px 10px", paddingLeft: prefix ? 20 : 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" }} />
      </div>
    </div>
  );
}

// ─── TAB 1: CATEGORIZER ──────────────────────────────────────────────────────
function CriterionItem({ c, checked, onToggle }) {
  const isNeg = c.type === "neg";
  return (
    <button onClick={() => onToggle(c.id)} style={{
      display: "flex", alignItems: "center", gap: 9, width: "100%",
      padding: "7px 10px", borderRadius: 7,
      border: checked ? `1px solid ${isNeg ? "#ef535040" : "#00e67640"}` : "1px solid rgba(255,255,255,0.06)",
      background: checked ? (isNeg ? "rgba(239,83,80,0.09)" : "rgba(0,230,118,0.07)") : "rgba(255,255,255,0.02)",
      cursor: "pointer", textAlign: "left",
    }}>
      <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: checked ? "none" : "1.5px solid rgba(255,255,255,0.2)", background: checked ? (isNeg ? "#ef5350" : "#00e676") : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <span style={{ color: "#000", fontSize: 9, fontWeight: 900 }}>✓</span>}
      </div>
      <span style={{ flex: 1, fontSize: 12, color: checked ? (isNeg ? "#ff8a80" : "#e8f5e9") : "rgba(255,255,255,0.5)" }}>{c.label}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: checked ? (isNeg ? "#ff5252" : "#00e676") : "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>{isNeg ? "−" : "+"}{c.pts}</span>
    </button>
  );
}

function CategorizerTab({ selectedSetup, setSelectedSetup, checked, setChecked, score, grade }) {
  const setup = selectedSetup ? SETUPS[selectedSetup] : null;
  const coreItems = setup ? setup.criteria.filter(c => c.group === "core") : [];
  const qualItems = setup ? setup.criteria.filter(c => c.group === "quality") : [];
  const riskItems = setup ? setup.criteria.filter(c => c.group === "risk") : [];
  const posHit = setup ? setup.criteria.filter(c => c.type === "pos" && checked[c.id]).reduce((s, c) => s + c.pts, 0) : 0;
  const negHit = setup ? setup.criteria.filter(c => c.type === "neg" && checked[c.id]).reduce((s, c) => s + c.pts, 0) : 0;
  const maxP = setup ? setup.criteria.filter(c => c.type === "pos").reduce((s, c) => s + c.pts, 0) : 0;

  return (
    <div>
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>SELECCIONA EL SETUP</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 5, marginBottom: 12 }}>
        {Object.values(SETUPS).map(s => (
          <button key={s.id} onClick={() => { setSelectedSetup(s.id); setChecked({}); }} style={{
            padding: "8px 5px", borderRadius: 9,
            border: selectedSetup === s.id ? `1.5px solid ${s.color}65` : "1px solid rgba(255,255,255,0.07)",
            background: selectedSetup === s.id ? `${s.color}10` : "rgba(255,255,255,0.02)",
            cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: 15 }}>{s.emoji}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: selectedSetup === s.id ? s.color : "rgba(255,255,255,0.4)", fontFamily: "monospace", lineHeight: 1.3, marginTop: 2 }}>{s.name}</div>
            <div style={{ fontSize: 8, color: selectedSetup === s.id ? `${s.color}80` : "rgba(255,255,255,0.2)", marginTop: 1 }}>{s.direction === "long" ? "▲ LONG" : "▼ SHORT"}</div>
          </button>
        ))}
      </div>

      {!setup ? (
        <div style={{ textAlign: "center", padding: 28, color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>📊</div>Selecciona un setup
        </div>
      ) : (
        <>
          <div style={{ background: grade.bg, border: `1.5px solid ${grade.color}45`, borderRadius: 13, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>CALIDAD</div>
                <div style={{ fontSize: 46, fontWeight: 900, color: grade.color, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>{grade.grade}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>SCORE</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: grade.color, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>{Math.round(score)}</div>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>/ 100</div>
              </div>
            </div>
            <ScoreBar score={score} color={grade.color} />
            <div style={{ display: "flex", gap: 10, marginTop: 6, justifyContent: "center" }}>
              <span style={{ fontSize: 9.5, color: "#00e676", fontFamily: "monospace" }}>+{posHit}</span>
              {negHit > 0 && <span style={{ fontSize: 9.5, color: "#ef5350", fontFamily: "monospace" }}>−{negHit}</span>}
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>máx {maxP}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
            {GRADES.filter(g => g.grade !== "✕").map(g => (
              <div key={g.grade} style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 20, background: `${g.color}14`, border: `1px solid ${g.color}35` }}>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: g.color, fontFamily: "monospace" }}>{g.grade}</span>
                <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)" }}>≥{g.min}</span>
                <span style={{ fontSize: 8.5, color: g.color }}>{(g.riskPct * 100).toFixed(0)}%R</span>
              </div>
            ))}
          </div>

          {[
            { label: "SEÑALES CORE", items: coreItems, accent: setup.color },
            { label: "CALIDAD / CONTEXTO", items: qualItems, accent: "#90caf9" },
            { label: "FACTORES DE RIESGO ⚠️", items: riskItems, accent: "#ef5350" },
          ].filter(g => g.items.length > 0).map(g => (
            <div key={g.label} style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: 1.5, marginBottom: 4, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 2, height: 8, background: g.accent, borderRadius: 1, display: "inline-block" }} />{g.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {g.items.map(c => <CriterionItem key={c.id} c={c} checked={!!checked[c.id]} onToggle={id => setChecked(prev => ({ ...prev, [id]: !prev[id] }))} />)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── TAB 2: CALCULATOR ───────────────────────────────────────────────────────
function CalculatorTab({ capital, setCapital, baseRiskPct, setBaseRiskPct, bbOffset, setBbOffset, entryPrice, setEntryPrice, slPrice, setSlPrice, ticker, setTicker, grade, selectedSetup, onSaveToLog }) {
  const effectivePct = Math.max(0.1, +(baseRiskPct + bbOffset).toFixed(1));
  const dailyR = capital * (effectivePct / 100);
  const ep = parseFloat(entryPrice) || 0;
  const sp = parseFloat(slPrice) || 0;
  const rps = Math.abs(ep - sp);
  const isValid = capital > 0 && rps > 0 && ep > 0;
  const bbMod = +bbOffset.toFixed(1);
  const bbLabel = bbMod > 0 ? `BOOST +${bbMod}%` : bbMod < 0 ? `BREAK ${bbMod}%` : null;
  const bbColor = bbMod > 0 ? "#00e676" : bbMod < 0 ? "#ff5252" : null;

  const positions = useMemo(() => {
    if (!isValid) return [];
    return GRADES.filter(g => g.grade !== "✕").map(g => {
      const dRisk = dailyR * g.riskPct;
      const shares = Math.floor(dRisk / rps);
      return { ...g, shares, dollarRisk: shares * rps, posSize: shares * ep };
    });
  }, [capital, effectivePct, ep, sp, isValid]);

  const canSave = isValid && selectedSetup && grade.grade !== "✕";

  return (
    <div>
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>CONFIGURACIÓN DE CUENTA</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <NumInput label="CAPITAL TOTAL" value={capital || ""} onChange={v => setCapital(parseFloat(v) || 0)} prefix="$" placeholder="25000" />
        <NumInput label="% RIESGO DIARIO" value={baseRiskPct || ""} onChange={v => setBaseRiskPct(parseFloat(v) || 1)} placeholder="1.0" />
      </div>

      {/* Break / Boost */}
      <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 8 }}>
        <button onClick={() => setBbOffset(p => +(Math.max(-3, p - 0.1)).toFixed(1))} style={{
          flex: 1, padding: "9px 6px", borderRadius: 9, border: "1px solid rgba(255,82,82,0.4)",
          background: "rgba(255,82,82,0.1)", color: "#ff5252", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
        }}>⬇ BREAK −0.1%</button>
        <div style={{ textAlign: "center", minWidth: 68 }}>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>RIESGO EFECTIVO</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: bbColor || "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{effectivePct.toFixed(1)}%</div>
          {bbLabel && <div style={{ fontSize: 8.5, color: bbColor, fontFamily: "monospace", fontWeight: 700 }}>{bbLabel}</div>}
        </div>
        <button onClick={() => setBbOffset(p => +(Math.min(3, p + 0.1)).toFixed(1))} style={{
          flex: 1, padding: "9px 6px", borderRadius: 9, border: "1px solid rgba(0,230,118,0.4)",
          background: "rgba(0,230,118,0.1)", color: "#00e676", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
        }}>⬆ BOOST +0.1%</button>
      </div>

      {capital > 0 && (
        <div style={{ padding: "7px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>1R DIARIO</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(dailyR)}</span>
        </div>
      )}

      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>TRADE</div>
      <div style={{ marginBottom: 7 }}>
        <Lbl>TICKER</Lbl>
        <input type="text" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="AAPL"
          style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: 1, outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <NumInput label="PRECIO ENTRADA" value={entryPrice || ""} onChange={setEntryPrice} prefix="$" placeholder="10.50" />
        <NumInput label="PRECIO STOP LOSS" value={slPrice || ""} onChange={setSlPrice} prefix="$" placeholder="9.80" />
      </div>

      {rps > 0 && (
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", marginBottom: 8 }}>
          RIESGO / ACCIÓN: <span style={{ color: "#fff", fontWeight: 700 }}>{fmt$(rps)}</span>
        </div>
      )}

      {isValid ? (
        <div style={{ borderRadius: 11, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "38px 1fr 1fr 1fr", background: "rgba(255,255,255,0.05)", padding: "7px 12px", gap: 4 }}>
            {["", "SHARES", "$ RIESGO", "R"].map((h, i) => (
              <div key={i} style={{ fontSize: 8.5, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: 1 }}>{h}</div>
            ))}
          </div>
          {positions.map((p, i) => (
            <div key={p.grade} style={{
              display: "grid", gridTemplateColumns: "38px 1fr 1fr 1fr",
              padding: "9px 12px", gap: 4,
              background: grade.grade === p.grade ? `${p.color}10` : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              borderLeft: grade.grade === p.grade ? `3px solid ${p.color}` : "3px solid transparent",
            }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: p.color, fontFamily: "'Space Grotesk', sans-serif" }}>{p.grade}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "'JetBrains Mono', monospace" }}>{fmtN(p.shares)}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(p.dollarRisk)}</div>
              <div style={{ fontSize: 11.5, color: p.color, fontFamily: "monospace", fontWeight: 700 }}>{(p.riskPct * 100).toFixed(0)}%R</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "18px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11.5, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.07)", marginBottom: 12 }}>
          Ingresa capital, entrada y stop para ver el sizing
        </div>
      )}

      <button onClick={onSaveToLog} disabled={!canSave} style={{
        width: "100%", padding: "12px", borderRadius: 10,
        background: canSave ? `linear-gradient(135deg, ${grade.color}28, ${grade.color}12)` : "rgba(255,255,255,0.04)",
        border: canSave ? `1.5px solid ${grade.color}55` : "1px solid rgba(255,255,255,0.07)",
        color: canSave ? grade.color : "rgba(255,255,255,0.2)",
        fontSize: 12, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed", fontFamily: "monospace", letterSpacing: 0.5,
      }}>
        {grade.grade !== "✕" && canSave ? `💾  REGISTRAR — ${ticker || "TICKER"} · ${grade.grade}` : !selectedSetup ? "Categoriza primero el play" : grade.grade === "✕" ? "⛔ DESCARTADO — no registrar" : "Rellena todos los campos"}
      </button>
    </div>
  );
}

// ─── TAB 3: LOG ──────────────────────────────────────────────────────────────
function LogTab({ log, setLog }) {
  const [editingNote, setEditingNote] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  if (log.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.22)", fontSize: 12 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
        Sin trades registrados aún.<br />
        <span style={{ fontSize: 10.5, marginTop: 4, display: "block" }}>Usa la calculadora para guardar plays.</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>REGISTRO DE TRADES</div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{log.length} trade{log.length !== 1 ? "s" : ""}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {[...log].reverse().map(entry => {
          const g = GRADES.find(g2 => g2.grade === entry.grade) || GRADES[GRADES.length - 1];
          const setupDef = entry.setupId ? SETUPS[entry.setupId] : null;
          const rps = Math.abs(entry.entryPrice - entry.slPrice);
          return (
            <div key={entry.id} style={{ borderRadius: 12, border: `1px solid ${g.color}28`, background: `${g.color}05`, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 19, fontWeight: 900, color: g.color, fontFamily: "'Space Grotesk', sans-serif" }}>{entry.grade}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{entry.ticker}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{entry.time} · {setupDef ? `${setupDef.emoji} ${setupDef.name}` : "–"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {entry.bbLabel && (
                    <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 5px", borderRadius: 9, background: entry.bbMod > 0 ? "rgba(0,230,118,0.15)" : "rgba(255,82,82,0.15)", color: entry.bbMod > 0 ? "#00e676" : "#ff5252", fontFamily: "monospace" }}>{entry.bbLabel}</span>
                  )}
                  <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", background: "rgba(255,255,255,0.06)", padding: "2px 5px", borderRadius: 5 }}>{Math.round(entry.score)}pts</span>
                  <button onClick={() => setLog(prev => prev.filter(e => e.id !== entry.id))} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.18)", cursor: "pointer", fontSize: 13, padding: "0 1px" }}>✕</button>
                </div>
              </div>

              {/* Prices row */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {[
                  { l: "ENTRADA", v: fmt$(entry.entryPrice) },
                  { l: "STOP",    v: fmt$(entry.slPrice) },
                  { l: "RIESGO/ACC", v: fmt$(rps) },
                ].map((item, i) => (
                  <div key={item.l} style={{ flex: 1, padding: "7px 10px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: 1 }}>{item.l}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.78)", fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{item.v}</div>
                  </div>
                ))}
              </div>

              {/* All-grade sizing */}
              <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.22)", fontFamily: "monospace", marginBottom: 5, letterSpacing: 1 }}>SIZING POR CALIDAD</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
                  {GRADES.filter(g2 => g2.grade !== "✕").map(g2 => {
                    const dr = entry.dailyR * g2.riskPct;
                    const sh = rps > 0 ? Math.floor(dr / rps) : 0;
                    const isActive = entry.grade === g2.grade;
                    return (
                      <div key={g2.grade} style={{ padding: "5px 6px", borderRadius: 6, background: isActive ? `${g2.color}15` : "rgba(255,255,255,0.03)", border: isActive ? `1px solid ${g2.color}35` : "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: g2.color, fontFamily: "monospace" }}>{g2.grade}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", fontFamily: "'JetBrains Mono', monospace" }}>{fmtN(sh)}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(sh * rps)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div style={{ padding: "7px 12px" }}>
                {editingNote === entry.id ? (
                  <div>
                    <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="Notas del trade..." rows={2}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff", fontSize: 12, padding: "6px 9px", resize: "none", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                    <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
                      <button onClick={() => { setLog(prev => prev.map(e => e.id === entry.id ? { ...e, notes: noteDraft } : e)); setEditingNote(null); }}
                        style={{ flex: 1, padding: "5px", borderRadius: 6, border: "none", background: "#00e676", color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Guardar</button>
                      <button onClick={() => setEditingNote(null)}
                        style={{ flex: 1, padding: "5px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer" }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => { setEditingNote(entry.id); setNoteDraft(entry.notes || ""); }} style={{ cursor: "pointer", minHeight: 20 }}>
                    {entry.notes
                      ? <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)", fontStyle: "italic", lineHeight: 1.4 }}>"{entry.notes}"</p>
                      : <p style={{ margin: 0, fontSize: 10.5, color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>+ Añadir nota...</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TAB 4: ALARMS ───────────────────────────────────────────────────────────
function AlarmsTab({ log, capital, effectivePct }) {
  const dailyR = capital * (effectivePct / 100);
  const totalRisked = log.reduce((sum, e) => {
    const rps = Math.abs(e.entryPrice - e.slPrice);
    const g = GRADES.find(g => g.grade === e.grade);
    if (!g || rps <= 0) return sum;
    const sh = Math.floor((e.dailyR * g.riskPct) / rps);
    return sum + sh * rps;
  }, 0);
  const pct = dailyR > 0 ? (totalRisked / dailyR) * 100 : 0;

  const alarms = [
    { label: "ALARMA 1 — Precaución", threshold: 30, color: "#ffeb3b", icon: "⚠️" },
    { label: "ALARMA 2 — Atención",   threshold: 50, color: "#ff9800", icon: "🔶" },
    { label: "ALARMA 3 — PELIGRO",    threshold: 75, color: "#f44336", icon: "🚨" },
  ];

  const overallColor = pct >= 75 ? "#f44336" : pct >= 50 ? "#ff9800" : pct >= 30 ? "#ffeb3b" : "#00e676";

  return (
    <div>
      {/* Summary */}
      <div style={{ borderRadius: 12, padding: "14px 15px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: 1.5 }}>RIESGO DIARIO (1R)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{fmt$(dailyR)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: 1.5 }}>COMPROMETIDO</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: overallColor, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{fmt$(totalRisked)}</div>
          </div>
        </div>
        <ScoreBar score={pct} color={overallColor} height={7} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>0%</span>
          <span style={{ fontSize: 10.5, fontWeight: 700, fontFamily: "monospace", color: overallColor }}>{Math.min(100, Math.round(pct))}% del R diario usado</span>
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>100%</span>
        </div>
      </div>

      {/* Alarm bars */}
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>ALARMAS DE RIESGO</div>
      {alarms.map(a => {
        const triggered = pct >= a.threshold;
        const fill = Math.min(100, (pct / a.threshold) * 100);
        return (
          <div key={a.threshold} style={{
            borderRadius: 11, padding: "12px 14px", marginBottom: 8,
            border: `1.5px solid ${triggered ? a.color : "rgba(255,255,255,0.07)"}`,
            background: triggered ? `${a.color}10` : "rgba(255,255,255,0.03)",
            transition: "all 0.3s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16, animation: triggered ? "pulse 1.2s infinite" : "none" }}>{triggered ? a.icon : "⏸"}</span>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: triggered ? a.color : "rgba(255,255,255,0.55)", fontFamily: "'Space Grotesk', sans-serif" }}>{a.label}</div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>Se activa al {a.threshold}% del R diario · {fmt$(dailyR * a.threshold / 100)}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: triggered ? a.color : "rgba(255,255,255,0.45)", fontFamily: "'Space Grotesk', sans-serif" }}>{Math.min(100, Math.round(pct))}%</div>
                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.22)", fontFamily: "monospace" }}>/ {a.threshold}%</div>
              </div>
            </div>
            <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fill}%`, background: triggered ? a.color : `${a.color}50`, borderRadius: 3, transition: "width 0.4s ease", boxShadow: triggered ? `0 0 10px ${a.color}70` : "none" }} />
            </div>
            {triggered && (
              <div style={{ marginTop: 6, fontSize: 10.5, color: a.color, fontWeight: 700, fontFamily: "monospace", animation: "pulse 1.5s infinite" }}>
                ACTIVADA — {Math.round(pct)}% del R diario comprometido
              </div>
            )}
          </div>
        );
      })}

      {/* Mini trade list */}
      {log.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.28)", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>TRADES REGISTRADOS</div>
          {log.map(e => {
            const g = GRADES.find(g2 => g2.grade === e.grade);
            const rps = Math.abs(e.entryPrice - e.slPrice);
            const sh = g && rps > 0 ? Math.floor((e.dailyR * g.riskPct) / rps) : 0;
            return (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 11px", borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: g?.color, fontFamily: "monospace" }}>{e.grade}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'Space Grotesk', sans-serif" }}>{e.ticker}</span>
                  {e.bbLabel && <span style={{ fontSize: 8.5, color: e.bbMod > 0 ? "#00e676" : "#ff5252", fontFamily: "monospace", fontWeight: 700 }}>{e.bbLabel}</span>}
                  <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{e.time}</span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.65)", fontFamily: "'JetBrains Mono', monospace" }}>{fmt$(sh * rps)}</span>
              </div>
            );
          })}
        </div>
      )}

      {capital === 0 && (
        <div style={{ textAlign: "center", padding: 16, color: "rgba(255,255,255,0.2)", fontSize: 11.5 }}>
          Configura tu capital en la pestaña Calculadora
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [checked, setChecked] = useState({});
  const [capital, setCapital] = useState(0);
  const [baseRiskPct, setBaseRiskPct] = useState(1.0);
  const [bbOffset, setBbOffset] = useState(0);
  const [entryPrice, setEntryPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");
  const [ticker, setTicker] = useState("");
  const [log, setLog] = useState([]);

  const effectivePct = Math.max(0.1, +(baseRiskPct + bbOffset).toFixed(1));
  const dailyR = capital * (effectivePct / 100);

  const { score, grade } = useMemo(() => {
    const setup = selectedSetup ? SETUPS[selectedSetup] : null;
    if (!setup) return { score: 0, grade: GRADES[GRADES.length - 1] };
    const pos = setup.criteria.filter(c => c.type === "pos");
    const neg = setup.criteria.filter(c => c.type === "neg");
    const maxP = pos.reduce((s, c) => s + c.pts, 0);
    const posHit = pos.filter(c => checked[c.id]).reduce((s, c) => s + c.pts, 0);
    const negHit = neg.filter(c => checked[c.id]).reduce((s, c) => s + c.pts, 0);
    const sc = maxP > 0 ? Math.max(0, (posHit - negHit) / maxP * 100) : 0;
    return { score: sc, grade: getGrade(sc) };
  }, [selectedSetup, checked]);

  function handleSaveToLog() {
    const ep = parseFloat(entryPrice);
    const sp = parseFloat(slPrice);
    if (!ep || !sp || !capital || !selectedSetup || grade.grade === "✕") return;
    const bbMod = +bbOffset.toFixed(1);
    setLog(prev => [...prev, {
      id: Date.now(),
      time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      ticker: ticker || "–",
      setupId: selectedSetup,
      grade: grade.grade,
      score,
      entryPrice: ep,
      slPrice: sp,
      dailyR,
      effectivePct,
      bbMod,
      bbLabel: bbMod > 0 ? `BOOST +${bbMod}%` : bbMod < 0 ? `BREAK ${bbMod}%` : null,
      notes: "",
    }]);
    setActiveTab(2);
  }

  // Alarm level for header indicator
  const totalRisked = log.reduce((sum, e) => {
    const rps = Math.abs(e.entryPrice - e.slPrice);
    const g = GRADES.find(g => g.grade === e.grade);
    if (!g || rps <= 0) return sum;
    return sum + Math.floor((e.dailyR * g.riskPct) / rps) * rps;
  }, 0);
  const riskPct = dailyR > 0 ? (totalRisked / dailyR) * 100 : 0;
  const alarmColors = { 30: "#ffeb3b", 50: "#ff9800", 75: "#f44336" };
  const alarmColor = riskPct >= 75 ? alarmColors[75] : riskPct >= 50 ? alarmColors[50] : riskPct >= 30 ? alarmColors[30] : null;

  const tabs = [
    { label: "SETUP", icon: "🎯" },
    { label: "CALC", icon: "💰" },
    { label: "LOG", icon: "📋", badge: log.length },
    { label: "RIESGO", icon: "🚨" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f12", color: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", maxWidth: 540, margin: "0 auto" }}>
      <style>{`
        @import url('${FONT_URL}');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.09); border-radius: 2px; }
        button { transition: opacity 0.1s; }
        button:active { opacity: 0.72; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#141720,#0d0f12)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.28)", letterSpacing: 3, fontFamily: "monospace" }}>XVN TRADING</div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.3 }}>Play Categorizer</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {capital > 0 && <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", fontFamily: "monospace" }}>{fmt$(dailyR)} <span style={{ color: "rgba(255,255,255,0.18)" }}>1R</span></div>}
          {alarmColor && (
            <div style={{ padding: "2px 7px", borderRadius: 20, background: `${alarmColor}18`, border: `1px solid ${alarmColor}55`, fontSize: 9.5, fontWeight: 700, color: alarmColor, fontFamily: "monospace", animation: riskPct >= 50 ? "pulse 1.5s infinite" : "none" }}>
              🚨 {Math.round(riskPct)}%
            </div>
          )}
          {selectedSetup && grade.grade !== "✕" && (
            <div style={{ padding: "2px 8px", borderRadius: 20, background: `${grade.color}16`, border: `1px solid ${grade.color}40`, fontSize: 11, fontWeight: 800, color: grade.color, fontFamily: "monospace" }}>{grade.grade}</div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#0e1015", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            flex: 1, padding: "10px 4px 8px", border: "none", background: "none", cursor: "pointer",
            borderBottom: activeTab === i ? "2px solid rgba(255,255,255,0.75)" : "2px solid transparent",
            position: "relative",
          }}>
            <div style={{ fontSize: 14 }}>{t.icon}</div>
            <div style={{ fontSize: 8.5, fontFamily: "monospace", letterSpacing: 0.5, marginTop: 1, color: activeTab === i ? "#fff" : "rgba(255,255,255,0.32)", fontWeight: activeTab === i ? 700 : 400 }}>{t.label}</div>
            {t.badge > 0 && (
              <div style={{ position: "absolute", top: 5, right: "calc(50% - 13px)", width: 13, height: 13, borderRadius: 7, background: "#00e676", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7.5, fontWeight: 900, color: "#000" }}>{t.badge}</div>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "13px 13px 30px" }}>
        {activeTab === 0 && <CategorizerTab selectedSetup={selectedSetup} setSelectedSetup={setSelectedSetup} checked={checked} setChecked={setChecked} score={score} grade={grade} />}
        {activeTab === 1 && <CalculatorTab capital={capital} setCapital={setCapital} baseRiskPct={baseRiskPct} setBaseRiskPct={setBaseRiskPct} bbOffset={bbOffset} setBbOffset={setBbOffset} entryPrice={entryPrice} setEntryPrice={setEntryPrice} slPrice={slPrice} setSlPrice={setSlPrice} ticker={ticker} setTicker={setTicker} grade={grade} selectedSetup={selectedSetup} onSaveToLog={handleSaveToLog} />}
        {activeTab === 2 && <LogTab log={log} setLog={setLog} />}
        {activeTab === 3 && <AlarmsTab log={log} capital={capital} effectivePct={effectivePct} />}
      </div>
    </div>
  );
}
