module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const systemInstruction = "As an ECU Housing assistant talking to a college student, please answer this question in a helpful, relatable, and friendly tone: ";
    const payload = [systemInstruction + prompt];

    const hfRes = await fetch(
      "https://ecupirate99-ecuresidencerag.hf.space/api/predict/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
        signal: AbortSignal.timeout(25000),
      }
    );

    if (!hfRes.ok) {
      const text = await hfRes.text();
      console.error("HuggingFace error:", hfRes.status, text);
      return res.status(502).json({ error: "Upstream error", detail: text });
    }

    const data = await hfRes.json();
    console.log("HF response:", JSON.stringify(data));
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err.name, err.message);
    return res.status(500).json({ error: err.name, message: err.message });
  }
};
