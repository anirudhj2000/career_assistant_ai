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
const collectionName = process.env.DOCUMENTDB_COLLECTION_NAME;

// Connect to DocumentDB
const connectToDatabase = async () => {
  if (!mongoClient.isConnected) {
    await mongoClient.connect();
  }
  return mongoClient.db(dbName).collection(collectionName);
};

// Get User Data
exports.getUserData = async (id) => {
  try {
    const collection = await connectToDatabase();
    const user = await collection.findOne({ id: id });
    console.log("User data: ", JSON.stringify(user));
    return user;
  } catch (err) {
    console.error("Error in getUserData: ", err);
  }
};

// Create New User
exports.createUser = async () => {
  try {
    const obj = {
      id: uuidv4(),
      type: userTypes.NEW_USER,
      name: "",
      email: "",
      phoneNumber: "",
      role: "",
      resume: "",
    };

    console.log("Creating new user: ", obj);
    const collection = await connectToDatabase();
    await collection.insertOne(obj);

    return {
      id: obj.id,
      type: userTypes.NEW_USER,
    };
  } catch (err) {
    console.error("Error in createUser: ", err);
  }
};

exports.updateUserData = async (id, data, type) => {
  try {
    console.log("Data in updateUserData: ", data);

    const resumeObject = await generateResumeObject(data);

    console.log("Resume Object: ", resumeObject, resumeObject.resume);

    // Create updateFields object directly
    const updateFields = {
      ...resumeObject.resume.personalDetails, // Spread all personal details
      resume: resumeObject.resume,
      type: type,
    };

    // Update the database
    const collection = await connectToDatabase();
    const response = await collection.updateOne(
      { id: id }, // Filter
      { $set: updateFields } // Update document
    );

    console.log("User data updated successfully", response);
  } catch (err) {
    console.error("Error in updateUserData: ", err);
  }
};

// Disconnect the client when the app shuts down
process.on("SIGINT", async () => {
  if (mongoClient.isConnected) {
    await mongoClient.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
});
