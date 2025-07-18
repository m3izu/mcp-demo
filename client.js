const axios = require('axios');

const prompt = process.argv[2];

if (!prompt) {
  console.error("prov a prompt");
  process.exit(1);
}

async function sendPrompt() {
  try {
    const res = await axios.post('http://localhost:3000/mcp', { prompt });
    console.log("Prompt:", prompt);
    console.log("Response:\n", res.data.output);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

sendPrompt();
