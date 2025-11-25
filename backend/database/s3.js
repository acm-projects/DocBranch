const dotenv = require('dotenv');
dotenv.config();
const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const config = {
  region: process.env.AWS_DEFAULT_REGION
};
const client = new S3Client(config);

/**
 * Upload a local file to S3.
 * @param {string} filePath - Path to a local file to upload.
 * @param {string} bucket
 * @param {string} key
 * @param {string} [contentType]
 */
const uploadFileToS3 = async (filePath, bucket, key, contentType = 'application/octet-stream') => {
  if (typeof filePath !== 'string') throw new Error('uploadFileToS3 expects a file path string as the first argument');
  const possiblePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
  if (!fs.existsSync(possiblePath) || !fs.statSync(possiblePath).isFile()) {
    throw new Error(`File not found: ${possiblePath}`);
  }

  const Body = fs.createReadStream(possiblePath);
  const input = {
    Body,
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  };

  const uploadCommand = new PutObjectCommand(input);
  try {
    const uploadResponse = await client.send(uploadCommand);
    console.log(`Uploaded ${possiblePath} to s3://${bucket}/${key}`);
    return uploadResponse;
  } catch (err) {
    console.error('S3 upload error:', err);
    throw err;
  }
}

/**
 * Upload a JavaScript object to S3 as JSON.
 * @param {Object} obj - Plain object to be JSON.stringified and uploaded.
 * @param {string} bucket
 * @param {string} key
 */
const uploadObjectToS3 = async (obj, bucket, key) => {
  if (typeof obj !== 'object' || obj === null) throw new Error('uploadObjectToS3 expects a non-null object as the first argument');
  const json = JSON.stringify(obj);
  const Body = Buffer.from(json, 'utf8');
  const input = {
    Body,
    Bucket: bucket,
    Key: key,
    ContentType: 'application/json',
    ContentLength: Body.length,
  };

  const uploadCommand = new PutObjectCommand(input);
  try {
    const uploadResponse = await client.send(uploadCommand);
    console.log(`Uploaded object to s3://${bucket}/${key}`);
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

/**
 * Delete a file from S3 using userId and resumeId to construct the key.
 * By default the key is `${userId}/${resumeId}`. Pass an optional keyPrefix
 * (e.g. 'resumes/') to change the prefix.
 * @param {string} userId
 * @param {string} resumeId
 * @param {string} bucket
 */
const deleteFromS3 = async (userId, resumeId, bucket) => {
  if (!userId || !resumeId) throw new Error('deleteFileFromS3 requires userId and resumeId');
  if (!bucket) throw new Error('deleteFileFromS3 requires bucket');

  // normalize prefix to ensure trailing slash if provided
  let prefix = 'resumes/';
  let fileType = 'json';

  const key = `${prefix}${userId}/${resumeId}.${fileType}`;
  const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  try {
    await client.send(cmd);
    console.log(`Deleted s3://${bucket}/${key}`);
    return { bucket, key, deleted: true };
  } catch (err) {
    console.error(`Error deleting s3://${bucket}/${key}:`, err);
    throw err;
  }
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
  uploadObjectToS3,
  downloadFileFromS3,
  deleteFromS3
};