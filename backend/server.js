const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const ConversationSchema = new mongoose.Schema({
  prompt: String,
  response: String,
  createdAt: { type: Date, default: Date.now },
});
const Conversation = mongoose.model("Conversation", ConversationSchema);

app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
model: 'openrouter/free',
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", 
          "X-Title": "AI Flow App",
        },
      },
    );

    const aiMessage = response.data.choices[0].message.content;
    res.json({ response: aiMessage });
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

app.post("/api/save", async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res
      .status(400)
      .json({ error: "Both prompt and response are required" });
  }

  try {
    const conversation = new Conversation({ prompt, response });
    await conversation.save();
    res.json({ message: "Saved successfully", id: conversation._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to save to database" });
  }
});


app.get('/api/latest-message', async (req, res) => {
  try {
    const latest = await Conversation.findOne().sort({ createdAt: -1 });
    res.json({ message: latest ? latest.prompt : 'Welcome to our store!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
