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

// Apply auth protection middleware to all these routes
router.use(protect);

// 1. History Routes
router.route("/history")
  .post(addHistory)
  .get(getHistory)
  .delete(clearHistory);

router.delete("/history/:id", deleteHistoryItem);

// 2. Watch Later Routes
router.route("/watch-later")
  .post(toggleWatchLater)
  .get(getWatchLater);

// 3. Favorites Routes
router.route("/favorites")
  .post(toggleFavorite)
  .get(getFavorites);

// Check Favorite/WatchLater status for a single video
router.get("/status/:videoId", checkVideoStatus);

export default router;
