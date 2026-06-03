import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
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
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find and update history entries
historySchema.index({ userId: 1, videoId: 1 });
historySchema.index({ userId: 1, watchedAt: -1 });

const History = mongoose.model("History", historySchema);

export default History;
