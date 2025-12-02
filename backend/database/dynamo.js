const {uploadObjectToS3, downloadFileFromS3, deleteFromS3} = require('./s3');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// AWS SDK v3 (modular) - use the Document client wrapper for convenient marshalling
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

// Create v3 clients
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-2',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});
const dynamoClient = DynamoDBDocumentClient.from(ddbClient);
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
  const resumes = await dynamoClient.send(new ScanCommand(param));
  //console.log(JSON.stringify(resumes, null, 2));
  return resumes;
}

const getProfiles = async () => {
  const param = {
    TableName: PROFILES
  };
  const profiles = await dynamoClient.send(new ScanCommand(param));
  //console.log(JSON.stringify(profiles, null, 2));
  return profiles;
}

const addOrUpdateResume = async (resumeDocument) => {
  if (!resumeDocument) {
    throw new Error('Resume document is required');
  }

  // Now require top-level keys
  if (!resumeDocument.user_id || !resumeDocument.resume_id) {
    throw new Error('Resume must include user_id and resume_id as top-level attributes');
  }

  const param = {
    TableName: TABLE_NAME,
    Item: resumeDocument
  };
  //console.log("Resume added/updated:", resume);
  await addOrUpdateProfile(resumeDocument.resume, resumeDocument.user_id);

  // ALSO ADD TO S3 AS JSON FILE
  await uploadObjectToS3(resumeDocument, "docbranchtestbucket", `resumes/${resumeDocument.user_id}/${resumeDocument.resume_id}.json`);

  return await dynamoClient.send(new PutCommand(param));
}


const addOrUpdateProfile = async (resume, user_id) => {
  if (!resume || !user_id) {
    throw new Error('Resume object and user_id are required');
  }

  // Fetch existing profile by user_id (use get since user_id is the key)
  const getParams = {
    TableName: PROFILES,
    Key: { user_id: user_id }
  };
  const existingRes = await dynamoClient.send(new GetCommand(getParams));
  const existing = existingRes && existingRes.Item ? existingRes.Item : {};

  const merged = mergeObjects(existing, resume);

  // Ensure the primary key is present on the item we put into DynamoDB.
  // merged may not include user_id (profiles often don't store it inside the profile object),
  // so explicitly set it from the function argument.
  merged.user_id = user_id;

  const param = {
    TableName: PROFILES,
    Item: merged
  };
  return await dynamoClient.send(new PutCommand(param));
}

const getResumesByUser = async (userid) => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'user_id = :uid',
    ExpressionAttributeValues: {
      ':uid': userid
    }
  };
  const resumes = await dynamoClient.send(new QueryCommand(params));
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
  const profiles = await dynamoClient.send(new QueryCommand(params));
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
  const resume = await dynamoClient.send(new GetCommand(params));
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

    await deleteFromS3(userid, resumeid, 'docbranchtestbucket');

  return await dynamoClient.send(new DeleteCommand(params));
}

const deleteProfileById = async (userid) => {
  const params = {
    TableName: PROFILES,
    Key: {
      user_id: userid
    }
  };
  return await dynamoClient.send(new DeleteCommand(params));
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
      // Attempt to load and add/update 10 resume files named
      // Allen_Zheng_Resume_01.json ... Allen_Zheng_Resume_10.json
      for (let i = 1; i <= 10; i++) {
        const idx = String(i).padStart(2, '0');
        const relPath = path.join(__dirname, '..', 'resume-generator', 'resume_json_files', `Allen_Zheng_Resume_${idx}.json`);
        if (!fs.existsSync(relPath)) {
          console.warn(`Skipping missing file: ${relPath}`);
          continue;
        }

        // require the JSON file. It may export the resume in different shapes;
        // prefer `newresume`, then `resume`, otherwise use the whole JSON.
        const newresume = require(relPath);

        await addOrUpdateResume(newresume);
      }

      //await addOrUpdateResume(newresume);
      //console.log("Returned: ", JSON.stringify(await deleteResumeById("0", "0"), null, 2));

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