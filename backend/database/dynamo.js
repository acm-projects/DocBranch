const AWS = require('aws-sdk');
const {uploadFileToS3, downloadFileFromS3} = require('./s3');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "DocBranch";
const PROFILES = "DocBranch_profiles";

// Helper utilities used for merging profiles/resumes
const clone = (v) => JSON.parse(JSON.stringify(v));

// Create a canonical JSON string with sorted object keys so that objects with
// the same key/values but different key order compare equal.
const canonicalStringify = (obj) => {
  const seen = new WeakSet();
  const canonical = (val) => {
    if (val === null || typeof val !== 'object') return val;
    if (Array.isArray(val)) return val.map(canonical);
    if (seen.has(val)) return undefined; // avoid cycles
    seen.add(val);
    const keys = Object.keys(val).sort();
    const out = {};
    keys.forEach(k => {
      out[k] = canonical(val[k]);
    });
    return out;
  };
  try {
    return JSON.stringify(canonical(obj));
  } catch (e) {
    return String(obj);
  }
};

const deepEqual = (a, b) => {
  try {
    return canonicalStringify(a) === canonicalStringify(b);
  } catch (e) {
    return false;
  }
};

/**
 * Merge two objects recursively.
 * - Arrays are unioned with deduplication (deep equality)
 * - Objects are merged recursively
 * - Primitives are overwritten by incoming (incoming prioritized)
 */
const mergeObjects = (existing = {}, incoming = {}) => {
  const out = clone(existing || {});
  Object.keys(incoming || {}).forEach(key => {
    const inVal = incoming[key];
    const exVal = out[key];

    if (inVal === undefined || inVal === null) return;

    if (Array.isArray(inVal)) {
      const base = Array.isArray(exVal) ? exVal.slice() : [];
      inVal.forEach(item => {
        const found = base.some(b => deepEqual(b, item));
        if (!found) base.push(clone(item));
      });
      out[key] = base;
    } else if (typeof inVal === 'object') {
      if (typeof exVal === 'object' && exVal !== null && !Array.isArray(exVal)) {
        out[key] = mergeObjects(exVal, inVal);
      } else {
        out[key] = clone(inVal);
      }
    } else {
      // primitive: incoming wins
      out[key] = inVal;
    }
  });
  return out;
};

const getResumes = async () => {
  const param = {
    TableName: TABLE_NAME
  };
  const resumes = await dynamoClient.scan(param).promise();
  //console.log(JSON.stringify(resumes, null, 2));
  return resumes;
}

const getProfiles = async () => {
  const param = {
    TableName: PROFILES
  };
  const profiles = await dynamoClient.scan(param).promise();
  //console.log(JSON.stringify(profiles, null, 2));
  return profiles;
}

const addOrUpdateResume = async (resume) => {
  if (!resume || !resume.user_id || !resume.resume_id) {
    throw new Error('Resume must include user_id and resume_id');
  }

  const param = {
    TableName: TABLE_NAME,
    Item: resume
  };
  //console.log("Resume added/updated:", resume);
  await addOrUpdateProfile(resume);

  // ALSO ADD TO S3 AS JSON FILE
  await uploadFileToS3(JSON.stringify(resume), "docbranchtestbucket", `resumes/${resume.user_id}/${resume.resume_id}.json`, "application/json");
  
  return await dynamoClient.put(param).promise();
}

const addOrUpdateProfile = async (profile) => {
  if (!profile || !profile.user_id) {
    throw new Error('Profile must include a user_id');
  }

  // Fetch existing profile by user_id (use get since user_id is the key)
  const getParams = {
    TableName: PROFILES,
    Key: { user_id: profile.user_id }
  };
  const existingRes = await dynamoClient.get(getParams).promise();
  const existing = existingRes && existingRes.Item ? existingRes.Item : {};

  const merged = mergeObjects(existing, profile);

  const param = {
    TableName: PROFILES,
    Item: merged
  };
  return await dynamoClient.put(param).promise();
}

const getResumesByUser = async (userid) => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'user_id = :uid',
    ExpressionAttributeValues: {
      ':uid': userid
    }
  };
  const resumes = await dynamoClient.query(params).promise();
  //console.log(JSON.stringify(resumes, null, 2));
  return resumes;
}

const getProfileByUser = async (userid) => {
  const params = {
    TableName: PROFILES,
    KeyConditionExpression: 'user_id = :uid',
    ExpressionAttributeValues: {
      ':uid': userid
    }
  };
  const profiles = await dynamoClient.query(params).promise();
  //console.log(JSON.stringify(profiles, null, 2));
  return profiles;
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
  //console.log(JSON.stringify(resume, null, 2));
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

const deleteProfileById = async (userid) => {
  const params = {
    TableName: PROFILES,
    Key: {
      user_id: userid
    }
  };
  return await dynamoClient.delete(params).promise();
}

const newresume = {
  user_id: "1",
  resume_id: "1",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  age: 30,
  skills: ["Java", "Python", "React"],
  experience: [
    {
      company: "Techno Corpo",
      role: "Backend Developer",
      start_date: "2021-01-01",
      end_date: "2022-01-01"
    }
  ]
        
  // user_id: '1',
  // resume_id: '1',
  // email: 'john.doe@example.com',
  // name: 'John Doe'
}

// Sample / test runner: only execute when this file is run directly (not when required)
// if (require.main === module) {
//   (async () => {
//     try {
//       console.log(JSON.stringify(await getProfiles(), null, 2));
//       console.log('Adding/updating profile with user_id 1');
//       await addOrUpdateProfile(newresume);
//       //console.log(JSON.stringify(await getProfileByUser('1'), null, 2));
//       //console.log('\n\n');
//       console.log(JSON.stringify(await getProfiles(), null, 2));
//       // console.log('Deleting profile with user_id 1');
//       // await deleteProfileById('1');
//       // console.log(JSON.stringify(await getProfiles(), null, 2));
//     } catch (err) {
//       console.error('Error running dynamo.js test runner:', err);
//     }
//   })();
// }

if (require.main === module) {
  (async () => {
    try {
      await addOrUpdateResume(newresume);
      console.log("Returned: ", JSON.stringify(await getResumesByUser("1"), null, 2));

      await downloadFileFromS3("docbranchtestbucket", `resumes/1/1.json`, "./downloaded_resume_1_1.json");
    } catch (err) {
      console.error('Error running dynamo.js test runner:', err);
    }
  })();
}


module.exports = {
  dynamoClient,
  getResumes,
  getProfiles,
  addOrUpdateResume,
  addOrUpdateProfile,
  getProfileByUser,
  getResumeById,
  deleteResumeById,
  getResumesByUser,
  deleteProfileById
};