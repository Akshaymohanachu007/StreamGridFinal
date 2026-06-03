import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDb from "./config/db.js";
import cron from "node-cron";
import { syncTrendingVideosToDB } from "./services/syncService.js";

import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";

import videoRoutes from "./routes/videoRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config()

const app = express();

app.use(cors({
  origin: [
    "https://stream-grid-final.vercel.app",
    "https://stream-grid-final-6cnxftdal-akshaymohanachu007s-projects.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
}));
app.use(express.json())

app.get("/", (req, res) => {
  console.log("welcome to streamGrid Api");
  res.send("stream grid api is running");
})
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes);

app.use("/api/videos", videoRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api", interactionRoutes);
app.use("/api/playlists", playlistRoutes);

app.use("/api/recommendations", recommendationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


// Schedule daily sync at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily sync...");
  await syncTrendingVideosToDB();
});

const PORT = process.env.PORT || 5000;

// Start server only after DB connects
const startServer = async () => {
  await connectDb(); // wait for MongoDB connection before anything else
  app.listen(PORT, () => {
    console.log(`Server running at Port: ${PORT}`);
  });
  // Initial sync AFTER DB is connected
  syncTrendingVideosToDB();
};

startServer();