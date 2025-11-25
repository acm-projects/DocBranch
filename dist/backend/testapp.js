import "dotenv/config";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
// ✅ Configure AWS SDK
const config = {
    region: process.env.AWS_REGION || "us-east-2",
};
const client = new S3Client(config);
// ✅ Upload file to S3
async function uploadFileToS3(localFilePath, bucket, key, contentType = "application/octet-stream") {
    try {
        const fileStream = fs.createReadStream(localFilePath);
        const input = {
            Body: fileStream,
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
        };
        const uploadCommand = new PutObjectCommand(input);
        await client.send(uploadCommand);
        console.log(`✅ Uploaded ${localFilePath} → s3://${bucket}/${key}`);
    }
    catch (err) {
        console.error("❌ Upload failed:", err);
    }
}
// ✅ Download file from S3
async function downloadFileFromS3(bucket, key, localFilePath) {
    try {
        const output = { Bucket: bucket, Key: key };
        const downloadCommand = new GetObjectCommand(output);
        const downloadResponse = await client.send(downloadCommand);
        const bytes = await downloadResponse.Body?.transformToByteArray();
        if (!bytes)
            throw new Error("No file body returned from S3.");
        fs.writeFileSync(localFilePath, Buffer.from(bytes));
        console.log(`✅ Downloaded s3://${bucket}/${key} → ${localFilePath}`);
    }
    catch (err) {
        console.error("❌ Download failed:", err);
    }
}
// ✅ Example usage (wrapped in an async function)
(async () => {
    await uploadFileToS3("goat.jpg", "docbranchtestbucket", "goat.jpg", "image/png");
    await downloadFileFromS3("docbranchtestbucket", "goat.jpg", "downloadedgoat.jpg");
})();
