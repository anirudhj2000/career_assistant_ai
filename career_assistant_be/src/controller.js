const { VoiceResponse } = require("twilio").twiml;
const { generateApiToken, getTwilioClient } = require("./utils");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const OpenAI = require("openai");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { convertAudioBuffer } = require("./utils");
const { s3Client } = require("./config/awsConfig");

const openai = new OpenAI();

const SYSTEM_MESSAGE =
  "Hi , you are AI assistant built for asking questions to build resume for people and will start conversation in hindi, you will ask the user to choose between hindi, telugu and marathi and then converse in that language only , you are start with asking 5 questions for building a resume and then readout the resume to them after asking those questions";

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

const firstFunction = (response) => {
  return new Promise(async (resolve, reject) => {
    const textResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "assistant",
          content: SYSTEM_MESSAGE,
        },
      ],
    });

    console.log("textResponse", JSON.stringify(textResponse));

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: textResponse.choices[0].message.content,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());

    console.log("buffer 1", buffer);

    const audioBuffer = await convertAudioBuffer(buffer);

    console.log("buffer 2", audioBuffer);

    let key = Date.now() + ".wav";

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${key}`,
      Body: audioBuffer,
    };

    console.log("uploadParams", uploadParams);
    await s3Client.send(new PutObjectCommand(uploadParams));

    console.log("response", `${process.env.AWS_CLOUDFRONT_URL}/${key}`);

    const gather = response.gather({
      input: "speech",
      action: `${process.env.API_URL}/api/handle-response`,
      method: "POST",
    });

    gather.play(`https://d27htzb2hgebok.cloudfront.net/1731605266765.wav`);

    resolve();
  });
};

exports.voiceResponse = async (req, res) => {
  console.log("req", req.query);

  const voiceResponse = new VoiceResponse();

  // if (questionIndex > 0) {
  //   await this.saveRecording(req);
  // } else {
  //   firstFunction(voiceResponse);
  // }

  await firstFunction(voiceResponse);

  // const questions = [
  //   "What is your name?",
  //   "How old are you?",
  //   "What is your favorite color?",
  //   "What city do you live in?",
  //   "What is your hobby?",
  // ];

  // if (questionIndex < questions.length) {
  //   askQuestion(voiceResponse, questions, questionIndex);
  // } else {
  //   voiceResponse.say("Thank you for your responses. Goodbye!");
  //   voiceResponse.hangup();
  // }

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

    // const response = await axios.get(recordingUrl, {
    //   responseType: "stream",
    //   headers: { Accept: "*/*" },
    //   maxBodyLength: Infinity,
    // });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: recordingUrl,
      headers: {},
      responseType: "stream",
    };

    axios
      .request(config)
      .then((response) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
          console.log(`Recording saved as ${filePath}`);
        });

        writer.on("error", (err) => {
          console.error("Error saving recording:", err);
        });
      })
      .catch((error) => {
        console.log("err", error);
      });
  } catch (err) {
    console.log("Error downloading recording:", err.message);
  }
};

exports.getJobs = async (req, res) => {
  const jobs = await scrapeJobs();
  res.status(200).send(jobs);
};
