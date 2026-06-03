import mongoose from "mongoose";
import dotenv from "dotenv";
import Video from "../models/Video.js";

dotenv.config();

const OLD_URL = "http://localhost:5000";
const NEW_URL = "https://streamgridfinal.onrender.com";

async function fixVideoUrls() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Find all videos with localVideoPath containing localhost
  const videos = await Video.find({
    localVideoPath: { $regex: "localhost", $options: "i" },
  });

  console.log(`Found ${videos.length} videos with localhost URLs`);

  for (const video of videos) {
    const oldPath = video.localVideoPath;
    const newPath = oldPath.replace(OLD_URL, NEW_URL);
    video.localVideoPath = newPath;
    await video.save();
    console.log(`✅ Updated: ${oldPath} → ${newPath}`);
  }

  console.log("🎉 Done! All video URLs updated.");
  await mongoose.disconnect();
}

fixVideoUrls().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
