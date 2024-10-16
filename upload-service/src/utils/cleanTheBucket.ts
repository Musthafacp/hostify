import AWS from "aws-sdk";
import { S3 } from "aws-sdk";

import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    endpoint: process.env.AWS_S3_ENDPOINT,
  });
  
  export const clearBucket = async (bucketName: string): Promise<string> => {
    if (!bucketName) {
      throw new Error("Bucket name is required");
    }
  
    const deleteObjects = async (objectsToDelete: S3.ObjectList) => {
      const validObjects = objectsToDelete
        .map(({ Key }) => (Key ? { Key } : null))
        .filter((obj): obj is { Key: string } => obj !== null);
  
      if (validObjects.length === 0) return;
  
      const deleteParams: S3.Types.DeleteObjectsRequest = {
        Bucket: bucketName,
        Delete: { Objects: validObjects },
      };
  
      await s3.deleteObjects(deleteParams).promise();
    };
  
    try {
      let isTruncated = true;
      let continuationToken: string | undefined = undefined;
  
      while (isTruncated) {
        const listedObjects = await s3
          .listObjectsV2({ Bucket: bucketName, ContinuationToken: continuationToken })
          .promise();
  
        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
          return "Bucket is already empty";
        }
  
        await deleteObjects(listedObjects.Contents);
        isTruncated = listedObjects.IsTruncated!;
        continuationToken = listedObjects.NextContinuationToken;
      }
  
      return "Bucket cleared successfully, including nested objects";
    } catch (error) {
      throw new Error(`Failed to clear bucket: ${error}`);
    }
  };
  