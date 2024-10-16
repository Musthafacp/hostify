"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllFiles = (dirPath) => {
    let result = [];
    try {
        const filesAndFolders = fs_1.default.readdirSync(dirPath);
        filesAndFolders.forEach(file => {
            const filePath = path_1.default.join(dirPath, file);
            if (fs_1.default.statSync(filePath).isDirectory()) {
                result = result.concat((0, exports.getAllFiles)(filePath));
            }
            else {
                result.push(filePath);
            }
        });
    }
    catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }
    return result;
};
exports.getAllFiles = getAllFiles;
