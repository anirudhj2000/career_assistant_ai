const { VoiceResponse } = require("twilio").twiml;
const { generateApiToken } = require("../utils/token");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/awsConfig");
const { scrapeJobs } = require("../utils/scraper");
const { resume_dummy } = require("../utils/consts");
const { generatePDF } = require("../helpers/generatePdf");

exports.createUser = async (req, res) => {
  try {
    const { identity } = req.body;
    const token = generateApiToken(identity);
    res.status(200).send({ token, identity });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

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
