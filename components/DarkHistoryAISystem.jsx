import React, { useState } from "react";

async function callBackendGenerate({ topic }) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: topic }),
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

export default function DarkHistoryAISystem() {
  const [topic, setTopic] = useState("buried alive true story");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const data = await callBackendGenerate({ topic });
      setResult(data.result || "No result");
    } catch (e) {
      setError(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 40,
        color: "white",
        background: "black",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 48, marginBottom: 30 }}>DARK HISTORY AI SYSTEM</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          padding: 12,
          width: "100%",
          maxWidth: 500,
          color: "black",
          fontSize: 18,
          marginBottom: 20,
        }}
      />

      <div>
        <button
          onClick={run}
          style={{
            padding: "12px 20px",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error ? (
        <div style={{ color: "#ff8080", marginTop: 20 }}>
          Error: {error}
        </div>
      ) : null}

      {result ? (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap", fontSize: 22 }}>
          {result}
        </div>
      ) : null}
    </div>
  );
}
