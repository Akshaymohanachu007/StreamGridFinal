import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a video is only added once to a user's Watch Later list
watchLaterSchema.index({ userId: 1, videoId: 1 }, { unique: true });

const WatchLater = mongoose.model("WatchLater", watchLaterSchema);

export default WatchLater;
