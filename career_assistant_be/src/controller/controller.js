const { VoiceResponse } = require("twilio").twiml;
const { generateApiToken } = require("../utils");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/awsConfig");
const { scrapeJobs } = require("../utils/scraper");

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
