import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "",
  secretAccessKey: "",
  endpoint: "",
});

//fileName=>output/9ijte
//FilePath=>/Users/palashkale/Desktop/Vercel/dist/output/q7cga/vite.config.js

export const uploadFile = async (fileName: string, localFilePath: string) => {
  console.log("Called");
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel",
      Key: fileName,
    })
    .promise();
  console.log(response);
};
