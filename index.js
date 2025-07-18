require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory context (fake memory for now)
let contextStore = [];

// POST /mcp — main endpoint for handling prompts
app.post('/mcp', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // Store prompt in memory (context simulation)
  const contextEntry = {
    prompt,
    timestamp: new Date().toISOString()
  };
  contextStore.push(contextEntry);

  // Call remote service
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const modelOutput =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'no respone gemini';

    res.json({
      context: contextStore,
      output: modelOutput
    });
  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    res.status(500).json({ error: 'status 500' });
  }
});

//  health check
app.get('/', (req, res) => {
  res.send('server c running (gemini)');
});

app.listen(PORT, () => {
  console.log(`C at http://localhost:${PORT}`);
});
