export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;
    const systemInstruction = "As an ECU Housing assistant talking to a college student, please answer this question in a helpful, relatable, and friendly tone: ";
    const payload = [systemInstruction + prompt];

    const hfRes = await fetch(
      "https://ecupirate99-ecuresidencerag.hf.space/api/predict/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload })
      }
    );
// Add this as api/debug.js
export default async function handler(req, res) {
  const hfRes = await fetch(
    "https://ecupirate99-ecuresidencerag.hf.space/api/predict/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: ["As an ECU Housing assistant talking to a college student, please answer this question in a helpful, relatable, and friendly tone: What dorms are available?"] })
    }
  );
  const data = await hfRes.json();
  return res.status(200).json(data); // raw response visible in browser
}
    const data = await hfRes.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy error" });
  }
}
