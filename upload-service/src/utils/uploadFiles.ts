import { S3 } from "aws-sdk";
import fs from "fs";

import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_S3_ENDPOINT,
});


export const uploadFiles = async (fileName: string, filePath: string) => {
    try {
        const fileContent = fs.readFileSync(filePath);
        const response = await s3.upload({
            Body: fileContent,
            Bucket: process.env.AWS_S3_BUCKET || "",
            Key: fileName
        }).promise();
    } catch (error) {
        console.error(`Error uploading file ${fileName}:`, error);
    }
};
