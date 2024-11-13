const { VoiceResponse } = require("twilio").twiml;
const { generateApiToken, getTwilioClient } = require("./utils");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

exports.generateToken = async (req, res) => {
  try {
    const { identity } = req.body;
    const token = generateApiToken(identity);
    res.status(200).send({ token, identity });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

function askQuestion(response, questions, index) {
  if (index < questions.length) {
    const gather = response.gather({
      input: "speech",
      action: `${process.env.API_URL}/api/handle-response?question=${index}`,
      method: "POST",
    });
    gather.say(questions[index]);
  } else {
    response.say("Thank you for your responses. Goodbye!");
    response.hangup();
  }
}

exports.voiceResponse = async (req, res) => {
  console.log("req", req.query);

  const voiceResponse = new VoiceResponse();
  let questionIndex = req.query.question ? parseInt(req.query.question, 10) : 0;

  if (questionIndex > 0) {
    await this.saveRecording(req); // Remove `res` parameter
  }

  const questions = [
    "What is your name?",
    "How old are you?",
    "What is your favorite color?",
    "What city do you live in?",
    "What is your hobby?",
  ];

  if (questionIndex < questions.length) {
    askQuestion(voiceResponse, questions, questionIndex);
  } else {
    voiceResponse.say("Thank you for your responses. Goodbye!");
    voiceResponse.hangup();
  }

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(voiceResponse.toString());
};

exports.handleResponse = async (req, res) => {
  const voiceResponse = new VoiceResponse();
  const currentQuestion = parseInt(req.query.question, 10);
  const nextQuestion = currentQuestion + 1;

  voiceResponse.record({
    action:
      process.env.API_URL + `/api/voice-response?question=${nextQuestion}`,
    method: "GET",
    maxLength: 30,
    playBeep: true,
  });

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(voiceResponse.toString());
};

exports.saveRecording = async (req) => {
  const recordingUrl = req.query.RecordingUrl;
  const recordingSid = req.query.RecordingSid;
  const questionNumber = req.query.question;

  try {
    const filePath = path.join(__dirname, `recordings/${recordingSid}.mp3`);

    const response = await axios.get(recordingUrl, {
      responseType: "stream",
      headers: { Accept: "*/*" },
      maxBodyLength: Infinity,
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      console.log(`Recording saved as ${filePath}`);
    });

    writer.on("error", (err) => {
      console.error("Error saving recording:", err);
    });
  } catch (err) {
    console.log("Error downloading recording:", err.message);
  }
};
