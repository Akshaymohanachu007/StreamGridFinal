import express from "express";

import {
  syncTrendingVideos,
} from "../controllers/youtubeController.js";

const router = express.Router();

router.post("/sync", syncTrendingVideos);

export default router;