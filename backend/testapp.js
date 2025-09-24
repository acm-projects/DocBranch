import "dotenv/config";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const config = {
  region: "us-east-2",
};
const client = new S3Client(config);

async function uploadFileToS3(localFilePath, bucket, key, contentType = "application/octet-stream") {
  const filestream = fs.createReadStream(localFilePath);
  const input = {
    Body: filestream,
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  };
  const uploadCommand = new PutObjectCommand(input);
  const uploadResponse = await client.send(uploadCommand);
  console.log(`Uploaded ${localFilePath} to s3://${bucket}/${key}`);
  return uploadResponse;
}

async function downloadFileFromS3(bucket, key, localFilePath) {
  const output = {
    Bucket: bucket,
    Key: key,
  };
  const downloadCommand = new GetObjectCommand(output);
  const downloadResponse = await client.send(downloadCommand);
  const bytes = await downloadResponse.Body.transformToByteArray();
  fs.writeFileSync(localFilePath, Buffer.from(bytes));
  console.log(`Downloaded s3://${bucket}/${key} to ${localFilePath}`);
  return downloadResponse;
}

// Example usage:
await uploadFileToS3("goat.jpg", "docbranchtestbucket", "goat.jpg", "image/png");
await downloadFileFromS3("docbranchtestbucket", "goat.jpg", "downloadedgoat.jpg");