import "dotenv/config";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const config = {
  region: "us-east-2",
};
const client = new S3Client(config);

async function uploadFileToS3(localFilePath, bucket, key, contentType = "application/octet-stream") {
  const absolutePath = path.isAbsolute(localFilePath) ? localFilePath : path.resolve(localFilePath);
  const filestream = fs.createReadStream(absolutePath);
  console.log(filestream)
  const input = {
    Body: filestream,
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  };
  const uploadCommand = new PutObjectCommand(input);
  const uploadResponse = await client.send(uploadCommand);
  console.log(`Uploaded ${absolutePath} to s3://${bucket}/${key}`);
  return uploadResponse;
}

async function downloadFileFromS3(bucket, key, localFilePath) {
  const absolutePath = path.isAbsolute(localFilePath) ? localFilePath : path.resolve(localFilePath);
  const output = {
    Bucket: bucket,
    Key: key,
  };
  const downloadCommand = new GetObjectCommand(output);
  const downloadResponse = await client.send(downloadCommand);
  const bytes = await downloadResponse.Body.transformToByteArray();
  fs.writeFileSync(absolutePath, Buffer.from(bytes));
  console.log(`Downloaded s3://${bucket}/${key} to ${absolutePath}`);
  return downloadResponse;
}

// Example usage:
import promptSync from 'prompt-sync';
const prompt = promptSync();

const uploadFileLocation = prompt('File path of uploaded file: ');
const downloadLocation = prompt('Location of downloaded file: ');
const s3Name = prompt('Name of file in s3: ');
const fileType = "image/png";

await uploadFileToS3(uploadFileLocation, "docbranchtestbucket", s3Name, fileType);
await downloadFileFromS3("docbranchtestbucket", s3Name, downloadLocation);