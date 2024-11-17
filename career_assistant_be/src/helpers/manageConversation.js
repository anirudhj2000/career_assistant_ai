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

    const conversationState = JSON.parse(completion.choices[0].message.content);
    return conversationState;
  } catch (error) {
    console.error("Error reading conversation state:", error);
    return {};
  }
};

exports.generateResumeSummary = async (resume) => {
  try {
    let prompt = `
        You are an assistant designed to generate a summary of a resume. Below are the fields to be included in the summary:
  
            resume format
          1. Personal Details
          2. Professional Summary
          3. Education
          4. Work Experience
          5. Skills
          6. Certifications and Awards
          7. Additional Information
  
          Based on the resume below,
          
          [Resume Start]
  
      `;

    prompt += "\n" + JSON.stringify(resume);
    prompt += ` 
          
  
          [Resume End]
  
          you are to return the summary of the resume in under 200 words and mention the data missing from the resumn if any which will be needed to asked from the user`;

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
            "Generate a summary of the resume and return on the summary in a paragraph format 1st pargraph should contain information present and then response  should contain list of items missing based on the resume format",
        },
      ],
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error("Error generating resume summary:", error);
    return {};
  }
};
