import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      enum: ["youtube", "local"],
      required: true,
    },

    youtubeVideoId: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      low: String,
      medium: String,
      high: String,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: [String],

    duration: {
      type: Number,
      default: 0,
    },

    
    views: {
      type: Number,
      default: 0,
    },

    
    likes: {
      type: Number,
      default: 0,
    },

    
    
    watchCount: {
      type: Number,
      default: 0,
    },

    
    trendingScore: {
      type: Number,
      default: 0,
    },

    channelName: {
      type: String,
      default: "",
    },

    localVideoPath: {
      type: String,
      default: "",
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

  },
  {
    timestamps: true,
  }
);

videoSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

const Video =
mongoose.model(
"Video",
videoSchema
);

export default Video;