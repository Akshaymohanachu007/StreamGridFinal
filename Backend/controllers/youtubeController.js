import { syncTrendingVideosToDB } from "../services/syncService.js";

export const syncTrendingVideos = async (req, res) => {
  try {
    await syncTrendingVideosToDB();

    res.json({
      success: true,
      message: "All categories synced successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};