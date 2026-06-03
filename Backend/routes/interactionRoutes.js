import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addHistory,
  getHistory,
  deleteHistoryItem,
  clearHistory,
  toggleWatchLater,
  getWatchLater,
  toggleFavorite,
  getFavorites,
  checkVideoStatus,
} from "../controllers/interactionController.js";

const router = express.Router();

router.use(protect);

router.route("/history")
  .post(addHistory)
  .get(getHistory)
  .delete(clearHistory);

router.delete("/history/:id", deleteHistoryItem);

router.route("/watch-later")
  .post(toggleWatchLater)
  .get(getWatchLater);

router.route("/favorites")
  .post(toggleFavorite)
  .get(getFavorites);

router.get("/status/:videoId", checkVideoStatus);

export default router;
