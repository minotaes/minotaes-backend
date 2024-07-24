import cookiesParser from "cookie-parser";
import express from "express";
import morgan from "morgan";

import cors from "cors";

const api = express();

api.set("port", 8000);

api.use(morgan("dev"));
api.use(cors());
api.use(express.json());
api.use(cookiesParser());
api.use(express.static("public"));

api.get("/", (req, res) => {
  res.send("<h1>minotaes backend is running ✅</h1>");
});

export { api };
