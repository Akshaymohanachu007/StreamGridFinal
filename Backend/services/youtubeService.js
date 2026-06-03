import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const fetchTrendingVideos = async (
  categoryId = "",
  maxResults = 100
) => {

  const params = {
    part: "snippet,statistics,contentDetails",
    chart: "mostPopular",
    regionCode: "IN",
    maxResults,
    key: process.env.YOUTUBE_API_KEY,
  };

  if (categoryId) {
    params.videoCategoryId = categoryId;
  }

  const response = await axios.get(
    `${BASE_URL}/videos`,
    { params }
  );

  return response.data.items;
};