import History from "../models/History.js";
import WatchLater from "../models/WatchLater.js";
import Favorite from "../models/Favorite.js";
import Video from "../models/Video.js";

// ==========================================
// 1. WATCH HISTORY CONTROLLERS
// ==========================================

// Add or update watch history
export const addHistory = async (req, res) => {

  try {

    const { videoId } = req.body;

    const userId = req.user._id;


    if (!videoId) {

      return res.status(400).json({
        success: false,
        message: "Video ID is required"
      });

    }



    // Check video exists

    const video =
      await Video.findById(videoId);


    if (!video) {

      return res.status(404).json({

        success: false,
        message: "Video not found"

      });

    }



    // Add or update history

    const history =
      await History.findOneAndUpdate(

        {
          userId,
          videoId
        },


        {
          watchedAt: new Date()
        },


        {
          upsert: true,
          new: true
        }

      );




    // 🔥 Update video analytics

    await Video.findByIdAndUpdate(

      videoId,

      {

        $inc: {

          watchCount: 1,

          views: 1

        }

      }

    );



    res.status(200).json({

      success: true,

      data: history

    });



  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }


};

// Get user's watch history (paginated & sorted)
export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await History.countDocuments({ userId });
    const historyItems = await History.find({ userId })
      .populate("videoId")
      .sort({ watchedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out entries where video might have been deleted from DB
    const validItems = historyItems.filter(item => item.videoId != null);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      count: validItems.length,
      data: validItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete single history item
export const deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await History.findOneAndDelete({ _id: id, userId });
    if (!result) {
      return res.status(404).json({ success: false, message: "History item not found" });
    }

    res.status(200).json({ success: true, message: "History item removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear all watch history for user
export const clearHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await History.deleteMany({ userId });
    res.status(200).json({ success: true, message: "Watch history cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. WATCH LATER CONTROLLERS
// ==========================================

// Toggle Watch Later status
export const toggleWatchLater = async (req, res) => {
  try {
    const { videoId } = req.body;
    const userId = req.user._id;

    if (!videoId) {
      return res.status(400).json({ success: false, message: "Video ID is required" });
    }

    const existing = await WatchLater.findOne({ userId, videoId });
    if (existing) {
      await WatchLater.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, isWatchLater: false, message: "Removed from Watch Later" });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    await WatchLater.create({ userId, videoId });
    res.status(201).json({ success: true, isWatchLater: true, message: "Added to Watch Later" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Watch Later listing
export const getWatchLater = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await WatchLater.countDocuments({ userId });
    const items = await WatchLater.find({ userId })
      .populate("videoId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const validItems = items.filter(item => item.videoId != null);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      count: validItems.length,
      data: validItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. FAVORITES CONTROLLERS
// ==========================================

// Toggle Favorite status
export const toggleFavorite = async (req, res) => {
  try {
    const { videoId } = req.body;
    const userId = req.user._id;

    if (!videoId) {
      return res.status(400).json({ success: false, message: "Video ID is required" });
    }

    const existing = await Favorite.findOne({ userId, videoId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, isFavorite: false, message: "Removed from Favorites" });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    await Favorite.create({ userId, videoId });
    res.status(201).json({ success: true, isFavorite: true, message: "Added to Favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Favorites list
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Favorite.countDocuments({ userId });
    const items = await Favorite.find({ userId })
      .populate("videoId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const validItems = items.filter(item => item.videoId != null);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      count: validItems.length,
      data: validItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check interactive status for a video (Favorites, Watch Later, and Playlists containing it)
export const checkVideoStatus = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const isFavorite = await Favorite.exists({ userId, videoId });
    const isWatchLater = await WatchLater.exists({ userId, videoId });

    res.status(200).json({
      success: true,
      isFavorite: !!isFavorite,
      isWatchLater: !!isWatchLater,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
