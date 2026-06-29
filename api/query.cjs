export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = req.body;

      // Your AI or proxy logic goes here
      res.status(200).json({
        success: true,
        message: "POST request received",
        prompt: body.prompt
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
