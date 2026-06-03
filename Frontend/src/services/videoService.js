import api from "../lib/api";

export const fetchVideos = async ({ page = 1, limit = 12, sort = "", category = "" } = {}) => {
  const response = await api.get("/videos", {
    params: { page, limit, sort, category },
  });
  return {
    videos: response.data.data,
    totalPages: response.data.totalPages,
  };
};

export const fetchTrendingVideos = async () => {
  const response = await api.get("/videos/trending");
  return response.data.data;
};

export const searchVideos = async (query) => {
  const response = await api.get(`/videos/search?q=${query}`);
  return response.data.videos;
};