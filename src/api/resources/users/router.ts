import { Router } from "express";
import { loginController } from "./controllers/index.js";

export const createRouter = (deps: ProjectDependencies) => {
  const router = Router();

  router.post("/login", loginController(deps));

  return router;
};
