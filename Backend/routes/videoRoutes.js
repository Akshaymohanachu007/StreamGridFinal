import express from "express";
import {
  createVideo,
  getVideos,
  getVideoById,
  searchVideos,
  getTrendingVideos,
} from "../controllers/videoController.js";

const router = express.Router();

router.get("/search", searchVideos);
router.get("/trending", getTrendingVideos);

router.route("/")
  .post(createVideo)
  .get(getVideos);

router.get("/:id", getVideoById);

export default router;