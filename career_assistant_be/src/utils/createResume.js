const OpenAI = require("openai");
const fs = require("fs");

async function generateResume(text) {
  const openai = new OpenAI();

  const response = await openai.Completion.create({
    model: "gpt-4",
    prompt: `Extract the following details from the text and format them as a JSON object: name, personal details, educational background, work experience.\n\nText: ${text}\n\nJSON:`,
    max_tokens: 150,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const resume = JSON.parse(response.choices[0].text.trim());
  return resume;
}

module.exports = { generateResume };
