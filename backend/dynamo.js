const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "DocBranch";

const getResumes = async () => {
  const param = {
    TableName: TABLE_NAME
  };
  const resumes = await dynamoClient.scan(param).promise();
  console.log(JSON.stringify(resumes, null, 2));
  return resumes;
}

const addOrUpdateResume = async (resume) => {
  const param = {
    TableName: TABLE_NAME,
    Item: resume
  };
  console.log("Resume added/updated:", resume);
  return await dynamoClient.put(param).promise();
}

const getResumeById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  }
  return await dynamoClient.get(params).promise();
}

const deleteResumeById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  };
  return await dynamoClient.delete(params).promise();
}
module.exports = {
  dynamoClient,
  getResumes,
  addOrUpdateResume,
  getResumeById,
  deleteResumeById
};