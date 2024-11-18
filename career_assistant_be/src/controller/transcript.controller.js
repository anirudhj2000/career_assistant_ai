const { MongoClient, ServerApiVersion } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const { userTypes } = require("../utils/consts");
const { generateResumeObject } = require("../helpers/manageConversation");
require("dotenv").config();

const mongoClient = new MongoClient(process.env.DOCUMENTDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = process.env.DOCUMENTDB_DB_NAME;
const collectionName = "transcripts";

// Connect to DocumentDB
const connectToDatabase = async () => {
  if (!mongoClient.isConnected) {
    await mongoClient.connect();
  }
  return mongoClient.db(dbName).collection(collectionName);
};

exports.createUserTranscript = async (id, transcript, sessionId) => {
  try {
    const collection = await connectToDatabase();
    const obj = {
      id: uuidv4(),
      userId: id,
      transcript: JSON.stringify(transcript),
      sessionId: sessionId,
    };
    await collection.insertOne(obj);
    console.log("Transcript created: ", obj);
    return obj;
  } catch (err) {
    console.error("Error in createUserTranscript: ", err);
  }
};

exports.getUserTranscripts = async (id) => {
  try {
    const collection = await connectToDatabase();
    const userTranscripts = await collection.find({ userId: id }).toArray();
    console.log("User transcripts: ", JSON.stringify(userTranscripts));
    return userTranscripts;
  } catch (err) {
    console.error("Error in getUserTranscripts: ", err);
  }
};
