const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", require("./src/routes"));

module.exports = app;

// if (
//   response.type ===
//   "conversation.item.input_audio_transcription.completed"
// ) {
//   console.log("Transcription complete", response.transcript.trim());

//   const action = await generateAppropriateAction(
//     response.transcript.trim()
//   );

//   console.log("Action", action);

//   const conversationItem = {
//     type: "conversation.item.create",
//     item: {
//       type: "message",
//       role: "user",
//       content: [
//         {
//           type: "input_text",
//           text: action,
//         },
//       ],
//     },
//   };

//   openAiWs.send(JSON.stringify(conversationItem));
//   openAiWs.send(JSON.stringify({ type: "response.create" }));
// }

// if (response.type === "response.done") {
//   console.log(
//     "Response done",
//     response.response.output[0]?.content?.find((c) => c.transcript)
//       ?.transcript
//   );
//   sendMark(connection, streamSid);
// }

// const generateAppropriateAction = async(string) => {
//     const completion = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//             { role: "system", content: "You are a helpful assistant. that will respond in the same language as the user , you are part of an system that is helping with user to search a job of get a resume , can on user input you can repond with either job opportunities or continue development" },
//             {
//                 role: "user",
//                 content: string,
//             },
//         ],
//     });

//     return completion.choices[0].message

// }
