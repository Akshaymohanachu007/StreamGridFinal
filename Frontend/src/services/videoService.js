import api from "../lib/api";

// FETCH VIDEOS (paginated, with optional sort & category)
export const fetchVideos = async ({ page = 1, limit = 12, sort = "", category = "" } = {}) => {
  const response = await api.get("/videos", {
    params: { page, limit, sort, category },
  });
  return {
    videos: response.data.data,
    totalPages: response.data.totalPages,
  };
};

// FETCH TRENDING VIDEOS
export const fetchTrendingVideos = async () => {
  const response = await api.get("/videos/trending");
  return response.data.data;
};

// SEARCH VIDEOS
export const searchVideos = async (query) => {
  const response = await api.get(`/videos/search?q=${query}`);
  return response.data.videos;
};