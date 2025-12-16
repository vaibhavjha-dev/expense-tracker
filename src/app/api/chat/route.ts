import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "edge";

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: google("gemini-2.5-flash"),
        temperature: 0,
        messages: [
            {
                role: "system",
                content: `
You are an expense tracker assistant.

RULES:
- If the user wants to add a transaction, respond ONLY with JSON.
- Do NOT include markdown.
- Do NOT explain anything.
- Use this exact schema:

{
  "action": "add_transaction",
  "data": {
    "amount": number,
    "description": string,
    "category": string,
    "type": "income" | "expense",
    "date": "YYYY-MM-DD" (optional)
  }
}

If the user is just chatting, respond with:

{
  "action": "chat",
  "message": "string"
}
        `,
            },
            ...messages,
        ],
    });

    return result.toTextStreamResponse();
}
