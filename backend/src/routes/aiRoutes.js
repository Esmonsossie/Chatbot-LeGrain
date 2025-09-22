import express from "express";
import { ask } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", ask); // POST /ask  { "question": "..." }

export default router;
