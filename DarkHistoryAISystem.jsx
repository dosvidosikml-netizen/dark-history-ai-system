import React, { useState } from "react";
import { Flame, Shield, Clapperboard, Copy } from "lucide-react";

// ==========================================
// DARK HISTORY AI SYSTEM — SAFE FRONTEND
// ==========================================
// OpenAI key is NOT entered in the UI.
// Frontend calls /api/generate
// Server injects OPENAI_API_KEY from env.

async function callBackendGenerate({ topic, mode, duration, pastData }) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic, mode, duration, pastData }),
  });

  if (!res.ok) {
    let message = "Server error";
    try {
      const err = await res.json();
      message = err?.error || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

function copy(text) {
  navigator.clipboard.writeText(text);
}

function Block({ title, value, small }) {
  return (
    <div className={`bg-gray-800 p-4 rounded-xl ${small ? "text-sm" : ""}`}>
      <div className="text-gray-400 mb-1">{title}</div>
      <div className="whitespace-pre-wrap">{value}</div>
    </div>
  );
}

export default function DarkHistoryAISystem() {
  const [topic, setTopic] = useState("buried alive true story");
  const [mode, setMode] = useState("pipeline");
  const [duration, setDuration] = useState(50);
  const [pastRaw, setPastRaw] = useState("ЕЁ ПОХОРОНИЛИ ЖИВОЙ | 1200000\nПОЧЕМУ РУКИ НАРУЖУ | 450000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const parsePastData = () => {
    return pastRaw
      .split("\n")
      .map((line) => {
        const [title, views] = line.split("|");
        return {
          title: (title || "").trim(),
          views: Number((views || "").trim()),
        };
      })
      .filter((x) => x.title && Number.isFinite(x.views) && x.views > 0);
  };

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await callBackendGenerate({
        topic,
        mode,
        duration,
        pastData: mode === "elite_mode" ? parsePastData() : [],
      });
      setData(result);
    } catch (e) {
      setError(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Flame /> DARK HISTORY AI SYSTEM
            </h1>
            <p style={{ color: "#9ca3af", marginTop: 8 }}>
              Safe version: the OpenAI key is hidden on the server. Frontend works через <code>/api/generate</code>.
            </p>
          </div>
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 8, alignItems: "center", color: "#d1d5db", fontSize: 14 }}>
            <Shield size={16} /> API key hidden server-side
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
            style={inputStyle}
          />

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={inputStyle}
          >
            <option value="pipeline">Pipeline</option>
            <option value="final_boss">Final Boss</option>
            <option value="elite_mode">Elite Mode</option>
            <option value="true_god_mode">True God Mode</option>
          </select>

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={inputStyle}
          />

          <button onClick={run} style={buttonStyle}>
            {loading ? "GENERATING..." : "RUN"}
          </button>
        </div>

        {mode === "elite_mode" ? (
          <textarea
            value={pastRaw}
            onChange={(e) => setPastRaw(e.target.value)}
            placeholder="title | views"
            style={{ ...inputStyle, minHeight: 140, width: "100%" }}
          />
        ) : null}

        {error ? (
          <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", borderRadius: 12, padding: 16, fontSize: 14 }}>
            {error}
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
          <Block
            title="Backend contract"
            value={"POST /api/generate\nbody: { topic, mode, duration, pastData }\nserver injects OPENAI_API_KEY from env\nclient never sees the secret"}
            small
          />
          <Block
            title="Deploy notes"
            value={"Use .env.local for OPENAI_API_KEY\nSet usage limits in OpenAI account\nDeploy frontend + API together on Vercel / Next.js"}
            small
          />
        </div>

        {data?.title || data?.hook || data?.thumbnailText || data?.thumbnail ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {data?.ultraHook ? <Block title="Ultra Hook" value={data.ultraHook} /> : null}
            {data?.hook ? <Block title="Hook" value={data.hook} /> : null}
            {data?.title ? <Block title="Title" value={data.title} /> : null}
            {data?.thumbnailText ? <Block title="Thumbnail Text" value={data.thumbnailText} /> : null}
            {!data?.thumbnailText && data?.thumbnail ? <Block title="Thumbnail" value={data.thumbnail} /> : null}
          </div>
        ) : null}

        {data?.thumbnailPrompt ? <Block title="THUMBNAIL PROMPT" value={data.thumbnailPrompt} /> : null}
        {data?.editingPlan ? <Block title="EDITING PLAN" value={data.editingPlan} /> : null}
        {data?.voiceSettings ? <Block title="VOICE SETTINGS" value={data.voiceSettings} /> : null}
        {data?.summary ? <Block title="SUMMARY" value={data.summary} /> : null}
        {data?.analysis ? <Block title="ANALYSIS" value={data.analysis} /> : null}

        {Array.isArray(data?.improvements) && data.improvements.length > 0 ? (
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Improvements</div>
            {data.improvements.map((item, idx) => (
              <div key={idx} style={{ fontSize: 14, color: "#d1d5db" }}>• {item}</div>
            ))}
          </div>
        ) : null}

        {Array.isArray(data?.nextIdeas) && data.nextIdeas.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Next Ideas</div>
            {data.nextIdeas.map((n, idx) => (
              <div key={idx} style={cardStyle}>
                <div style={{ fontWeight: 700 }}>{n.title}</div>
                <div>Hook: {n.hook}</div>
                <div style={{ fontSize: 14, color: "#9ca3af" }}>{n.reason}</div>
              </div>
            ))}
          </div>
        ) : null}

        {Array.isArray(data?.top) && data.top.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Top Videos</div>
            {data.top.map((v, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ fontWeight: 700 }}>{v.title}</div>
                {v.hook ? <div>Hook: {v.hook}</div> : null}
                {v.thumbnail ? <div>Thumbnail: {v.thumbnail}</div> : null}
                {v.script ? <div style={{ fontSize: 14, color: "#d1d5db", whiteSpace: "pre-wrap" }}>{v.script}</div> : null}
                {Array.isArray(v.thumbs) && v.thumbs.length > 0 ? (
                  <div style={{ display: "grid", gap: 4 }}>
                    <div style={{ fontSize: 14, color: "#9ca3af" }}>A/B thumbnails</div>
                    {v.thumbs.map((th, idx) => <div key={idx} style={{ fontSize: 14 }}>{idx + 1}. {th}</div>)}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {Array.isArray(data?.series) && data.series.length > 0 ? (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Series</div>
            {data.series.map((s, i) => (
              <div key={i} style={cardStyle}>{s.part} — {s.title}</div>
            ))}
          </div>
        ) : null}

        {Array.isArray(data?.plan) && data.plan.length > 0 ? (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>30-day plan</div>
            {data.plan.map((p, i) => (
              <div key={i} style={{ fontSize: 14, color: "#d1d5db" }}>Day {p.day}: {p.idea}</div>
            ))}
          </div>
        ) : null}

        {Array.isArray(data?.videos) && data.videos.length > 0 ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Generated Videos</div>
            {data.videos.map((v, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ fontWeight: 700 }}>{i + 1}. {v.title}</div>
                {v.hook ? <div>Hook: {v.hook}</div> : null}
                {v.thumbnail ? <div>Thumbnail: {v.thumbnail}</div> : null}
                {Array.isArray(v.frames) ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    {v.frames.map((f, idx) => (
                      <div key={idx} style={{ fontSize: 14, color: "#d1d5db" }}>{f.time} — {f.visual}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {Array.isArray(data?.frames) && data.frames.length > 0 ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Frames</div>
            {data.frames.map((f, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}>
                    <Clapperboard size={16} /> Frame {i + 1} — {f.time}
                  </div>
                  <button
                    onClick={() => copy(`${f.imagePrompt || ""}\n\n${f.videoPrompt || ""}`)}
                    style={{ ...secondaryButtonStyle, display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <Copy size={16} /> Copy prompts
                  </button>
                </div>
                {f.visual ? <Block title="Visual" value={f.visual} /> : null}
                {f.vo ? <Block title="VO" value={f.vo} /> : null}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
                  {f.imagePrompt ? <Block title="IMAGE PROMPT" value={f.imagePrompt} small /> : null}
                  {f.videoPrompt ? <Block title="VIDEO PROMPT" value={f.videoPrompt} small /> : null}
                  {f.sfx ? <Block title="SFX" value={f.sfx} small /> : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 12,
  background: "#111827",
  border: "1px solid #1f2937",
  borderRadius: 12,
  color: "#fff",
  width: "100%",
};

const buttonStyle = {
  padding: "12px 24px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "10px 12px",
  background: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const cardStyle = {
  background: "#111827",
  padding: 16,
  borderRadius: 12,
  display: "grid",
  gap: 8,
};
