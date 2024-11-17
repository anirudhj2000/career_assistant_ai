const OpenAI = require("openai");
const fs = require("fs");
const openai = new OpenAI();

exports.getCurrentConversationState = async (transcript) => {
  try {
    let prompt = `
      You are an assistant designed to classify conversation transcripts into predefined stages of a resume-building and job search process. Below are the stages:

        1. User Initiation and Identification
          - New User
          - Existing User
        2. Language Selection
          - Select Language
          - Confirm Language
        3. Resume Building Process
          - Personal Details
          - Professional Summary
          - Education
          - Work Experience
          - Skills
          - Certifications and Awards
          - Additional Information
        4. Resume Confirmation
        5. Job Search Activation
        6. Handling Existing Users
          - Update Resume
          - Search for Jobs
        7. Job Search Execution
        8. Session Termination

        Based on the transcript below,
        
        [Transcript Start]

    `;

    prompt += "\n" + transcript;
    prompt += ` 
        

        [Transcript End]

        you are to return only a json object containing fields stage , sub_stage if applicatble and description of the stage and nothing else`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content:
            "Get the current stage of the conversation and return only the json object",
        },
      ],
      response_format: {
        // See /docs/guides/structured-outputs
        type: "json_schema",
        json_schema: {
          name: "conversation_state_schema",
          schema: {
            type: "object",
            properties: {
              stage: {
                description:
                  "stage of the conversation process based on the transcript",
                type: "string",
              },
              sub_stage: {
                description:
                  "sub stage of the conversation process based on the transcript",
                type: "string",
              },
              description: {
                description:
                  "description of the stage of the conversation process based on the transcript",
                type: "string",
              },
            },
            additionalProperties: false,
          },
        },
      },
    });

    console.log(completion.choices[0]);

    const conversationState = JSON.parse(completion.choices[0].message.content);
    return conversationState;
  } catch (error) {
    console.error("Error reading conversation state:", error);
    return {};
  }
};

module.exports.generateResume = async (text) => {
  const openai = new OpenAI();

  const response = await openai.Completion.create({
    model: "gpt-4o",
    prompt: `Extract the following details from the text and format them as a JSON object: name, personal details, educational background, work experience.\n\nText: ${text}\n\nJSON:`,
    max_tokens: 150,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const resume = JSON.parse(response.choices[0].text.trim());
  return resume;
};
