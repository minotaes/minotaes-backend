import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
} from "./controllers/index.js";
import { preRegisterController } from "./controllers/pre-register.js";

export const createRouter = (deps: ProjectDependencies) => {
  const router = Router();

  router.post("/login", loginController(deps));
  router.post("/pre-register", preRegisterController(deps));
  router.post("/register", registerController(deps));

  router.post("/forgot-password", forgotPasswordController(deps));
  router.post("/reset-password", resetPasswordController(deps));
  return router;
};
