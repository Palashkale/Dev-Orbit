import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string): string[] => {
  let response: string[] = [];
  const allFilesAndFolders = fs.readdirSync(folderPath);

  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    //'/Users/palashkale/Desktop/Vercel/dist/output/qbp21/package.json',
    if (fs.statSync(fullFilePath).isDirectory()) {
      //will concatinate
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });

  return response; // Added return statement to return the result
};
