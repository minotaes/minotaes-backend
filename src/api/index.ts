import fs from "fs";
import path from "path";
import url from "url";

import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(process.cwd(), "public");

const api = express();

api.set("port", 8000);

api.use(morgan("dev"));
api.use(cors());
api.use(express.json());
api.use(cookieParser());
api.use(express.static(publicPath));

const resourcesPath = path.join(__dirname, "resources");
try {
  const resources = fs.readdirSync(resourcesPath);

  for (const resource of resources) {
    const resourcePath = path.join(resourcesPath, resource);
    const routerPath = path.join(resourcePath, "router.js");
    const URL = url.pathToFileURL(routerPath).href;

    import(URL)
      .then(({ router }) => {
        console.log(`Imported ${resource}`);
        api.use(`/api/${resource}`, router);
      })
      .catch((error) => {
        console.error(`Error importing ${resource}: ${error.message}`);
      });
  }
} catch (error: any) {
  console.error(`Error reading resources directory: ${error.message}`);
}

export { api };
