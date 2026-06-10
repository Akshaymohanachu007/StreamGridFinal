import Video from "../models/Video.js";
import Category from "../models/Category.js";
import { fetchTrendingVideos } from "./youtubeService.js";

export const syncTrendingVideosToDB = async () => {
  try {
    console.log("Starting database sync...");

    const categoriesToSync = [
      { name: "Trending", slug: "trending", icon: "🔥", ytCategoryId: "" },
      { name: "Gaming", slug: "gaming", icon: "🎮", ytCategoryId: "20" },
      { name: "Music", slug: "music", icon: "🎵", ytCategoryId: "10" },
      { name: "Sports", slug: "sports", icon: "⚽", ytCategoryId: "17" },
      { name: "Technology", slug: "technology", icon: "💻", ytCategoryId: "28" },
      { name: "Movies", slug: "movies", icon: "🎬", ytCategoryId: "1" }
    ];

    const categoryMap = {};
    for (const cat of categoriesToSync) {
      let category = await Category.findOne({ slug: cat.slug });
      if (!category) {
        category = await Category.create({
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon
        });
      } else {
        if (category.icon !== cat.icon) {
          category.icon = cat.icon;
          await category.save();
        }
      }
      categoryMap[cat.slug] = category._id;
    }


    await Video.deleteMany({ sourceType: "youtube" });
    console.log("Cleared existing YouTube videos to prevent orphan/broken category references.");

    let totalSynced = 0;

    for (const cat of categoriesToSync) {
      console.log(`Fetching videos for category: ${cat.name}...`);
      try {
        const videos = await fetchTrendingVideos(cat.ytCategoryId, 15);
        console.log(`Fetched ${videos?.length || 0} videos for ${cat.name}`);

        if (!videos || videos.length === 0) continue;

        const categoryId = categoryMap[cat.slug];

        for (const item of videos) {
          const exists = await Video.findOne({ youtubeVideoId: item.id });
          if (exists) continue;

          await Video.create({
            sourceType: "youtube",
            youtubeVideoId: item.id,
            title: item.snippet.title,
            description: item.snippet.description || "",
            thumbnail: {
              low: item.snippet.thumbnails?.default?.url || "",
              medium: item.snippet.thumbnails?.medium?.url || "",
              high: item.snippet.thumbnails?.high?.url || "",
            },
            categoryId: categoryId,
            tags: item.snippet.tags || [],
            views: Number(item.statistics?.viewCount || 0),
            channelName: item.snippet.channelTitle || "",
            publishedAt: item.snippet.publishedAt || new Date(),
          });
          totalSynced++;
        }
      } catch (err) {
        console.error(`Failed to sync category ${cat.name}:`, err.message);
      }
    }

    console.log(`Sync completed successfully. Added ${totalSynced} videos across categories.`);
  } catch (error) {
    console.error("Error during trending videos sync:", error.message);
  }
};
