import { Router } from "express";
import { loginController, registerController } from "./controllers/index.js";

export const createRouter = (deps: ProjectDependencies) => {
  const router = Router();

  router.post("/login", loginController(deps));
  router.post("/register", registerController(deps));

  return router;
};
