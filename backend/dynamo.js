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
  //console.log("Resume added/updated:", resume);
  return await dynamoClient.put(param).promise();
}

const getResumesByUser = async (userid) => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'user_id = :uid',
    ExpressionAttributeValues: {
      ':uid': userid
    }
    // Key: {
    //   user_id: userid
    // }
  };
  const resumes = await dynamoClient.query(params).promise();
  console.log(JSON.stringify(resumes, null, 2));
  return resumes;
}

const getResumeById = async (userid, resumeid) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      user_id: userid,
      resume_id: resumeid
    }
  }
  const resume = await dynamoClient.get(params).promise();
  console.log(JSON.stringify(resume, null, 2));
  return resume;
}

const deleteResumeById = async (userid, resumeid) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      user_id: userid,
      resume_id: resumeid
    }
  };
  return await dynamoClient.delete(params).promise();
}

// const newresume = {
//   user_id: "1",
//   resume_id: "1",
//   name: "John Doe",
//   email: "john.doe@example.com",
// }

//addOrUpdateResume(newresume);
getResumesByUser('0');

module.exports = {
  dynamoClient,
  getResumes,
  addOrUpdateResume,
  getResumeById,
  deleteResumeById,
  getResumesByUser
};