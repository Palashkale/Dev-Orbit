"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadS3Folder = downloadS3Folder;
exports.copyFinalDist = copyFinalDist;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "30eadbdfd7ed74570b7c60559ab04edd",
    secretAccessKey: "89de2ee1ffc7d8aaec6b4172e18d469008eed1905a4bc9897947a667989258dc",
    endpoint: "https://e4cce3abbac2227cf4dac24974ce8f5a.r2.cloudflarestorage.com",
});
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const allFiles = yield s3
            .listObjectsV2({
            Bucket: "vercel",
            Prefix: prefix,
        })
            .promise();
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map((_a) => __awaiter(this, [_a], void 0, function* ({ Key }) {
            return new Promise((resolve) => {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path_1.default.join(__dirname, Key);
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                const dirName = path_1.default.dirname(finalOutputPath);
                // Ensure directory exists
                if (!fs_1.default.existsSync(dirName)) {
                    fs_1.default.mkdirSync(dirName, { recursive: true });
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
        }))) || [];
        console.log("Downloading files...");
        yield Promise.all(allPromises.filter((x) => x !== undefined));
    });
}
function copyFinalDist(id) {
    const folderPath = path_1.default.join(__dirname, `output/${id}/dist`);
    // Check if the folder exists before proceeding
    if (!fs_1.default.existsSync(folderPath)) {
        console.error(`Error: Directory not found: ${folderPath}`);
        return;
    }
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach((file) => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });
}
const getAllFiles = (folderPath) => {
    let response = [];
    // Handle case where folderPath does not exist
    if (!fs_1.default.existsSync(folderPath)) {
        console.warn(`Warning: Directory does not exist: ${folderPath}`);
        return response;
    }
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach((file) => {
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileContent = fs_1.default.readFileSync(localFilePath);
        const response = yield s3
            .upload({
            Body: fileContent,
            Bucket: "vercel",
            Key: fileName,
        })
            .promise();
        console.log(`Uploaded: ${fileName}`, response);
    }
    catch (err) {
        console.error(`Failed to upload file: ${fileName}`, err);
    }
});
