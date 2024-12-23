import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
  accessKeyId: "",
  secretAccessKey: "",
  endpoint: "",
});

export async function downloadS3Folder(prefix: string) {
  const allFiles = await s3
    .listObjectsV2({
      Bucket: "vercel",
      Prefix: prefix,
    })
    .promise();

  const allPromises =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise((resolve) => {
        if (!Key) {
          resolve("");
          return;
        }
        const finalOutputPath = path.join(__dirname, Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);

        // Ensure directory exists
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }

        // Download file
        s3.getObject({
          Bucket: "vercel",
          Key,
        })
          .createReadStream()
          .pipe(outputFile)
          .on("finish", () => {
            resolve("");
          })
          .on("error", (err) => {
            console.error(`Failed to download file: ${Key}`, err);
            resolve("");
          });
      });
    }) || [];

  console.log("Downloading files...");
  await Promise.all(allPromises.filter((x) => x !== undefined));
}

export function copyFinalDist(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/dist`);

  // Check if the folder exists before proceeding
  if (!fs.existsSync(folderPath)) {
    console.error(`Error: Directory not found: ${folderPath}`);
    return;
  }

  const allFiles = getAllFiles(folderPath);
  allFiles.forEach((file) => {
    uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
  });
}

const getAllFiles = (folderPath: string): string[] => {
  let response: string[] = [];

  // Handle case where folderPath does not exist
  if (!fs.existsSync(folderPath)) {
    console.warn(`Warning: Directory does not exist: ${folderPath}`);
    return response;
  }

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};

const uploadFile = async (fileName: string, localFilePath: string) => {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3
      .upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
      })
      .promise();
    console.log(`Uploaded: ${fileName}`, response);
  } catch (err) {
    console.error(`Failed to upload file: ${fileName}`, err);
  }
};
