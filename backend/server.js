// Please Use Internet Connection to run Entire Project

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

dotenv.config(); 


const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const endpoint = "https://models.inference.ai.azure.com";
const token = process.env["GITHUB_TOKEN"];
const modelName = "gpt-4o-mini";

const client = new ModelClient(endpoint, new AzureKeyCredential(token));

// --- POST Route for Chat ---
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  const userMessage = messages.map(m => m.content).join(" ");
 
  try {
    const response = await client.path("/chat/completions").post({
      body: {
        messages,
        model: modelName,
      },
    });

    if (response.status !== "200") {
      console.error("Model error:", response.body.error);
      return res
        .status(500)
        .json({ error: "Failed to fetch response from GPT-4o" });
    }
  
    const botMessage =
      response.body.choices?.[0]?.message?.content || "No response from model.";
    res.json({ choices: [{ message: { content: botMessage } }] });
  } catch (err) {
    console.error("Server caught error:", err);
    res.status(500).json({ error: "Server error occurred." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
