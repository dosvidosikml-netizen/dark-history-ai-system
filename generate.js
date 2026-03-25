export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const { topic, mode = "pipeline", duration = 50, pastData = [] } = req.body || {};

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "Topic is required" });
    }

    const payload = buildModePayload({ topic, mode, duration, pastData });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: payload.temperature,
        response_format: { type: "json_object" },
        messages: payload.messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: `OpenAI request failed: ${text}`,
      });
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "Empty response from OpenAI" });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(502).json({ error: "Invalid JSON returned from OpenAI" });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Unexpected server error",
    });
  }
}

function buildModePayload({ topic, mode, duration, pastData }) {
  switch (mode) {
    case "pipeline":
      return {
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content:
              "You are a film director for viral dark history Shorts. Return strict JSON: {title,hook,ultraHook,thumbnailText,thumbnailPrompt,editingPlan,voiceSettings,summary,frames:[{time,visual,imagePrompt,videoPrompt,vo,sfx}]}. Rules: 9:16, photorealistic cinematic, ARRI/RED look, 35/50/85mm lens language, faces visible, no silhouettes, no modern elements if historical, each frame 2-4 seconds, total 45-60 seconds, VO in Russian, image prompts in English, video prompts concise, SFX clean studio-grade with no hum or hiss.",
          },
          {
            role: "user",
            content: `Topic: ${topic}\nDuration: ${duration} seconds`,
          },
        ],
      };

    case "final_boss":
      return {
        temperature: 1,
        messages: [
          {
            role: "system",
            content:
              "Return strict JSON: {trends:[string],top:[{title,hook,thumbs:[string],script}],plan:[{day:number,idea:string}]}. Optimize for viral short-form dark-history content. Give 3 top ideas. Each thumbs array must contain exactly 5 thumbnail text variants. Scripts should be concise and platform-ready.",
          },
          {
            role: "user",
            content: `Topic: ${topic}`,
          },
        ],
      };

    case "true_god_mode":
      return {
        temperature: 1,
        messages: [
          {
            role: "system",
            content:
              "Return strict JSON: {top:[{title,hook,thumbnail,script}],series:[{part,title}],plan:[{day:number,idea:string}]}. Choose the best 3 viral dark-history short-form ideas automatically. Make the series feel connected and the 30-day plan practical.",
          },
          {
            role: "user",
            content: `Topic: ${topic}`,
          },
        ],
      };

    case "elite_mode":
      return {
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "Return strict JSON: {analysis:string,improvements:[string],nextIdeas:[{title,hook,reason}]}. Analyze past short-form video performance and recommend how to improve the next dark-history videos.",
          },
          {
            role: "user",
            content: JSON.stringify({ topic, pastData }),
          },
        ],
      };

    default:
      return {
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content:
              "Return strict JSON: {title,hook,summary}. Keep it concise and useful for a dark-history content creator.",
          },
          {
            role: "user",
            content: `Topic: ${topic}`,
          },
        ],
      };
  }
}
