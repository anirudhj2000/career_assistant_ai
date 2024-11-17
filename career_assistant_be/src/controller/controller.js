const { VoiceResponse } = require("twilio").twiml;
const { generateApiToken } = require("../utils/token");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { s3Client } = require("../config/awsConfig");
const { scrapeJobs } = require("../utils/scraper");
const { resume_dummy } = require("../utils/consts");
const { generatePDF } = require("../helpers/generatePdf");
const { wsEvents } = require("../utils/readyEvent");
const {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { userTypes } = require("../utils/consts");

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handleIncomingCall = (req, res) => {
  console.log("Incoming call from:", req.query.From, req.headers.host);
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
                          <Response>
                              <Connect>
                                  <Stream url="wss://${req.headers.host}/media-stream" />
                              </Connect>
                          </Response>`;
  res.type("text/xml").send(twimlResponse);
};

exports.initializeUser = async (req, res) => {
  try {
    const { identity, newUser, id } = req.body;

    let userId;
    let type;

    if (newUser) {
      // Create a new user in the database
      const obj = {
        id: uuidv4(),
        type: userTypes.NEW_USER,
        name: "",
        email: "",
        phone: "",
        role: "",
        resume: "",
      };
      const params = {
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        Item: obj,
      };
      await dynamoDBDocumentClient.send(new PutCommand(params));
      userId = obj.id;
      type = userTypes.NEW_USER;
    } else {
      const response = await this.getUserData(id);
      userId = response.id;
      type = response.type;
    }

    const token = generateApiToken(identity);

    wsEvents.emit("initializeWs", { id: userId, type: type });
    res.status(200).send({ token, id: userId });
  } catch (err) {
    wsEvents.emit("resetWs");
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getJobs = async (req, res) => {
  let type = req.query.type;

  const jobs = await scrapeJobs(type);
  res.status(200).send(jobs);
};

exports.generateResumePdf = async (req, res) => {
  try {
    const { resume } = req.body;
    const pdf = await generatePDF(resume_dummy);
    res.status(200).send(pdf);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getUserData = async (userId) => {
  const command = new GetCommand({
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: {
      id: userId,
    },
  });

  const response = await dynamoDBDocumentClient.send(command);
  return response.Item;
};
