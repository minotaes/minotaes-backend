import { Router } from "express";

export const router = Router();

export const createRouter = () => {
  router.get("/", (req, res) => {
    res.json({ message: "pong" });
  });

  return router;
};
