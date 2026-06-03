import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ success: false, message: "Playlist name is required" });
    }

    const playlist = await Playlist.create({
      name,
      description,
      userId,
      videos: [],
    });

    res.status(201).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: playlists.length, data: playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findOne({ _id: id, userId }).populate("videos");
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ success: false, message: "Playlist name is required" });
    }

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, userId },
      { name, description },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findOneAndDelete({ _id: id, userId });
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    res.status(200).json({ success: true, message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addVideoToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoId } = req.body;
    const userId = req.user._id;

    if (!videoId) {
      return res.status(400).json({ success: false, message: "Video ID is required" });
    }

    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    const playlist = await Playlist.findOne({ _id: id, userId });
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    
    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({ success: false, message: "Video is already in the playlist" });
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json({ success: true, message: "Video added to playlist", data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { id, videoId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findOne({ _id: id, userId });
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    
    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId);
    await playlist.save();

    res.status(200).json({ success: true, message: "Video removed from playlist", data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
