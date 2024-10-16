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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const generateRandom_1 = require("./utils/generateRandom");
const uploadFiles_1 = require("./utils/uploadFiles");
const getAllFiles_1 = require("./utils/getAllFiles");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
console.log(__dirname);
app.post("/git", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    const git = (0, simple_git_1.default)();
    const id = (0, generateRandom_1.generateRandomString)();
    try {
        yield git.clone(url, path_1.default.join(__dirname, `output/${id}`));
        const files = (0, getAllFiles_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
        files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, uploadFiles_1.uploadFiles)(file.slice(__dirname.length + 1).replace(/\\/g, "/"), file.replace(/\\/g, "/"));
        }));
        res.send({ url, id });
    }
    catch (error) {
        console.log(error);
    }
}));
app.listen(3000, () => {
    console.log("app is listening on port 3000!");
});
