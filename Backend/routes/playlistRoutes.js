import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createPlaylist)
  .get(getPlaylists);

router.route("/:id")
  .get(getPlaylistById)
  .put(updatePlaylist)
  .delete(deletePlaylist);

router.post("/:id/videos", addVideoToPlaylist);
router.delete("/:id/videos/:videoId", removeVideoFromPlaylist);

export default router;
