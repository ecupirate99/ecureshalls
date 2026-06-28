import { Client } from "@gradio/client";

async function main() {
  const client = await Client.connect("ecupirate99/ecuresidencerag");
  const systemInstruction = "As an ECU Housing assistant talking to a college student, please answer this question in a helpful, relatable, and friendly tone: ";
  const question = "how about parking";
  const result = await client.predict(0, [systemInstruction + question]);
  console.log("Result:", result);
}

main().catch(console.error);
