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
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "30eadbdfd7ed74570b7c60559ab04edd",
    secretAccessKey: "89de2ee1ffc7d8aaec6b4172e18d469008eed1905a4bc9897947a667989258dc",
    endpoint: "https://e4cce3abbac2227cf4dac24974ce8f5a.r2.cloudflarestorage.com",
});
//fileName=>output/9ijte
//FilePath=>/Users/palashkale/Desktop/Vercel/dist/output/q7cga/vite.config.js
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Called");
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = yield s3
        .upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    })
        .promise();
    console.log(response);
});
exports.uploadFile = uploadFile;
