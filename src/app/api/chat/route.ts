import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google("gemini-2.5-flash-lite"),
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are an expense tracker assistant.
The current date is ${new Date().toISOString().split('T')[0]}.

ALLOWED CATEGORIES:
- Income: "salary", "freelance", "investments", "other"
- Expense: "food", "transport", "housing", "utilities", "entertainment", "health", "shopping", "travel", "recreational", "other"

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
    "date": "YYYY-MM-DD"
  }
}

CATEGORY RULES:
- You must strictly use one of the ALLOWED CATEGORIES listed above.
- If the user's input does not exactly match a category, try to map it logically (e.g., "groceries" -> "food", "bus" -> "transport").
- If you cannot map it to a specific category, use "other".

DATE RULES:
- If the user DOES NOT mention a date, use the current date (${new Date().toISOString().split('T')[0]}).
- If the user says "today", use the current date (${new Date().toISOString().split('T')[0]}).
- If the user mentions a specific date, parse it to YYYY-MM-DD.

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
