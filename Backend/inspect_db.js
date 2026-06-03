import dns from 'dns';
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Video from './models/Video.js';
import { syncTrendingVideosToDB } from './services/syncService.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/streamgrid";

async function inspect() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const categories = await Category.find();
  console.log(`Categories found: ${categories.length}`);
  console.log(JSON.stringify(categories, null, 2));

  const videos = await Video.find().populate('categoryId');
  console.log(`Videos found: ${videos.length}`);
  if (videos.length > 0) {
    console.log("Populated category details of first 5 videos:", videos.slice(0, 5).map(v => ({ title: v.title, categoryId: v.categoryId ? v.categoryId._id : null, categorySlug: v.categoryId ? v.categoryId.slug : null })));
    console.log("Unique category slugs in populated videos:", [...new Set(videos.map(v => v.categoryId ? v.categoryId.slug : 'null'))]);
  }

  await mongoose.disconnect();
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
