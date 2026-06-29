export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

      res.status(200).json({
        success: true,
        prompt: body.prompt,
        message: "POST request received"
      });
    } catch (err) {
      console.error("API ERROR:", err);
      res.status(500).json({ success: false, error: err.message });
    }
    return;
  }

  if (req.method === "GET") {
    res.status(200).json({ message: "GET is working" });
    return;
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
