const { S3Client } = require("@aws-sdk/client-s3");

exports.s3Client = new S3Client({
  region: process.env.AWS_REGION_1,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_1_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
