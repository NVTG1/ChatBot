import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import systemPrompts from "./prompts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { persona, message } = req.body;

  if (!persona || !message) {
    return res.status(400).json({
      error: "persona and message are required",
    });
  }

  const systemPrompt = systemPrompts[persona];

  if (!systemPrompt) {
    return res.status(400).json({
      error: "Unknown persona",
    });
  }

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to get response",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});