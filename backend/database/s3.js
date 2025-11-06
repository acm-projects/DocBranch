const dotenv = require('dotenv');
dotenv.config();
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const config = {
  region: process.env.AWS_DEFAULT_REGION
};
const client = new S3Client(config);

const uploadFileToS3 = async (localFilePathOrBody, bucket, key, contentType = "application/octet-stream") => {
  // localFilePathOrBody can be:
  // - a path to an existing local file (string)
  // - a string body
  // - a Buffer
  // - an object (will be JSON.stringified)

  let Body;
  let resolvedPath;

  if (typeof localFilePathOrBody === 'string') {
    // Check if it's a path to an existing file
    const possiblePath = path.isAbsolute(localFilePathOrBody) ? localFilePathOrBody : path.resolve(localFilePathOrBody);
    if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
      resolvedPath = possiblePath;
      Body = fs.createReadStream(resolvedPath);
    } else {
      // treat as raw string body
      Body = Buffer.from(localFilePathOrBody, 'utf8');
      // if contentType was default, assume text/plain
      if (contentType === 'application/octet-stream') contentType = 'text/plain; charset=utf-8';
    }
  } else if (Buffer.isBuffer(localFilePathOrBody)) {
    Body = localFilePathOrBody;
  } else if (typeof localFilePathOrBody === 'object' && localFilePathOrBody !== null) {
    // JSON object
    const json = JSON.stringify(localFilePathOrBody);
    Body = Buffer.from(json, 'utf8');
    contentType = 'application/json';
  } else {
    throw new Error('Unsupported body type for uploadFileToS3');
  }

  const input = {
    Body,
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  };

  // If Body is a Buffer or string, set ContentLength to avoid undefined-length streaming headers
  if (Buffer.isBuffer(Body)) {
    input.ContentLength = Body.length;
  }

  const uploadCommand = new PutObjectCommand(input);
  try {
    const uploadResponse = await client.send(uploadCommand);
    if (resolvedPath) console.log(`Uploaded ${resolvedPath} to s3://${bucket}/${key}`);
    else console.log(`Uploaded data to s3://${bucket}/${key}`);
    return uploadResponse;
  } catch (err) {
    console.error('S3 upload error:', err);
    throw err;
  }
}

const downloadFileFromS3 = async (bucket, key, localFilePath) => {
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
// import promptSync from 'prompt-sync';
// const prompt = promptSync();

// const uploadFileLocation = prompt('File path of uploaded file: ');
// const downloadLocation = prompt('Location of downloaded file: ');
// const s3Name = prompt('Name of file in s3: ');
// const fileType = "image/png";

// await uploadFileToS3(uploadFileLocation, "docbranchtestbucket", s3Name, fileType);
// await downloadFileFromS3("docbranchtestbucket", s3Name, downloadLocation);

module.exports = {
  uploadFileToS3,
  downloadFileFromS3
};