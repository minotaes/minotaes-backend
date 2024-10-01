import { Router } from "express";
import { loginController, registerController } from "./controllers/index.js";
import { preRegisterController } from "./controllers/pre-register.js";

export const createRouter = (deps: ProjectDependencies) => {
  const router = Router();

  router.post("/login", loginController(deps));
  router.post("/pre-register", preRegisterController(deps));
  router.post("/register", registerController(deps));

  return router;
};
