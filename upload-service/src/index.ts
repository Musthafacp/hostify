import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
import { generateRandomString } from "./utils/generateRandom";
import { uploadFiles } from "./utils/uploadFiles";
import { getAllFiles } from "./utils/getAllFiles";
import { clearBucket } from "./utils/cleanTheBucket";

const PORT = process.env.PORT || 3000;
const bucketName = process.env.AWS_S3_BUCKET;

const publisher = createClient();
publisher.on("error", (err) => {
  console.log("Redis Client Error", err);
});
publisher.connect();

const subscriber = createClient();
subscriber.on("error", (err) => {
  console.log("Redis Client Error", err);
});
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const { repoUrl } = req.body;
  const git = simpleGit();
  const id = generateRandomString();
  try {
    await git.clone(repoUrl, path.join(__dirname, `output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    files.forEach(async (file) => {
      await uploadFiles(
        file.slice(__dirname.length + 1).replace(/\\/g, "/"),
        file.replace(/\\/g, "/")
      );
    });

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    console.log("Pushed to queue successfully");
    res.send({ repoUrl, id });
  } catch (error) {
    res.status(404).send({message : "Repository Not Found 404"})
    console.log(error);
  }
});

app.use("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});



app.post("/clear-bucket", async (req, res) => {
  try {
    if (!bucketName) {
      return res.status(400).json({ message: "Missing bucket name" });
    }

    const result = await clearBucket(bucketName);
    res.status(200).json({ message: result });
  } catch (error: any) {
    console.error("Error clearing the bucket:", error);
    res.status(500).json({ message: error.message });
  }
});


app.listen(PORT, () => {
  console.log("app is listening on port " + PORT + "!");
});
