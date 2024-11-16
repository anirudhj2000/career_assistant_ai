const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

exports.s3Client = new S3Client({
  region: process.env.AWS_REGION_1,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_1_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION_2,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_1_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
