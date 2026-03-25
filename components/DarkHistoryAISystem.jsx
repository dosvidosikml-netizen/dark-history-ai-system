import React, { useState } from "react";

export default function DarkHistoryAISystem() {
  const [topic, setTopic] = useState("buried alive true story");

  return (
    <div style={{ padding: 40, color: "white", background: "black", minHeight: "100vh" }}>
      <h1>DARK HISTORY AI SYSTEM</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          padding: 10,
          marginTop: 20,
          width: "100%",
          maxWidth: 400,
          color: "black"
        }}
      />

      <div style={{ marginTop: 20 }}>
        Topic: {topic}
      </div>
    </div>
  );
}
