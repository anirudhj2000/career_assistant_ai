const { VoiceResponse } = require("twilio").twiml;
const { generateApiToken } = require("../utils/token");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { scrapeJobs } = require("../utils/scraper");
const { resume_dummy } = require("../utils/consts");
const { generatePDF } = require("../helpers/generatePdf");
const { wsEvents } = require("../utils/readyEvent");
const { userTypes } = require("../utils/consts");
const { createUser, getUserData } = require("./user.controller");
const { getUserTranscripts } = require("./transcript.controller");

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
      const response = await createUser();
      userId = response.id;
      type = response.type;
    } else {
      const response = await getUserData(id);
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
  let { id } = req.params;

  userData = await getUserData(id);
  if (!userData) {
    res.status(404).send("User not found");
  }

  role = userData.role;

  if (!role) {
    role = await this.generateUserRoleFromResume(userData.resume);
  }

  const jobs = await scrapeJobs(role);
  res.status(200).send(jobs);
};

exports.getTranscriptData = async (req, res) => {
  try {
    const { id } = req.params;

    const transcript = await getUserTranscripts(id);
    res.status(200).send(transcript);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
