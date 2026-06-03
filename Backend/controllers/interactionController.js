import History from "../models/History.js";
import WatchLater from "../models/WatchLater.js";
import Favorite from "../models/Favorite.js";
import Video from "../models/Video.js";

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

    

    const video =
      await Video.findById(videoId);

    if (!video) {

      return res.status(404).json({

        success: false,
        message: "Video not found"

      });

    }

    

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

export const clearHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await History.deleteMany({ userId });
    res.status(200).json({ success: true, message: "Watch history cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
