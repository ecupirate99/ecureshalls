export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { prompt } = body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const systemInstruction = "As an ECU Housing assistant talking to a college student, please answer this question in a helpful, relatable, and friendly tone: ";
    const fullPrompt = systemInstruction + prompt;
    const HF_BASE = "https://ecupirate99-ecuresidencerag.hf.space";

    // Step 1: POST to get event_id
    const postRes = await fetch(`${HF_BASE}/gradio_api/call/ask_question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [fullPrompt] }),
      signal: AbortSignal.timeout(15000),
    });

    if (!postRes.ok) {
      const text = await postRes.text();
      console.error("HF POST error:", postRes.status, text);
      return res.status(502).json({ error: "HF POST failed", status: postRes.status, detail: text.slice(0, 300) });
    }

    const { event_id } = await postRes.json();
    console.log("HF event_id:", event_id);

    // Step 2: GET the result stream using event_id
    const getRes = await fetch(`${HF_BASE}/gradio_api/call/ask_question/${event_id}`, {
      signal: AbortSignal.timeout(25000),
    });

    if (!getRes.ok) {
      const text = await getRes.text();
      console.error("HF GET error:", getRes.status, text);
      return res.status(502).json({ error: "HF GET failed", status: getRes.status });
    }

    // Parse the SSE stream to find the "complete" event
    const text = await getRes.text();
    console.log("HF stream response:", text.slice(0, 500));

    const lines = text.split("\n");
    let answer = null;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("event: complete")) {
        const dataLine = lines[i + 1];
        if (dataLine && dataLine.startsWith("data: ")) {
          const parsed = JSON.parse(dataLine.slice(6));
          answer = parsed[0];
          break;
        }
      }
    }

    if (!answer) {
      console.error("Could not parse answer from stream:", text);
      return res.status(502).json({ error: "Could not parse HF response", raw: text.slice(0, 500) });
    }

    return res.status(200).json({ data: [answer] });

  } catch (err) {
    console.error("Proxy error:", err.name, err.message);
    return res.status(500).json({ error: err.name, message: err.message });
  }
}
