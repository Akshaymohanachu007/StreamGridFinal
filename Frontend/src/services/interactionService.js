import api from "../lib/api";

// 1. WATCH HISTORY SERVICES
export const addToHistory = async (videoId) => {
  const response = await api.post("/history", { videoId });
  return response.data;
};

export const fetchHistory = async (page = 1, limit = 12) => {
  const response = await api.get("/history", {
    params: { page, limit },
  });
  return {
    items: response.data.data,
    totalPages: response.data.totalPages,
    total: response.data.total,
  };
};

export const removeHistoryItem = async (historyId) => {
  const response = await api.delete(`/history/${historyId}`);
  return response.data;
};

export const clearAllHistory = async () => {
  const response = await api.delete("/history");
  return response.data;
};

// 2. WATCH LATER SERVICES
export const toggleWatchLaterApi = async (videoId) => {
  const response = await api.post("/watch-later", { videoId });
  return response.data;
};

export const fetchWatchLater = async (page = 1, limit = 12) => {
  const response = await api.get("/watch-later", {
    params: { page, limit },
  });
  return {
    items: response.data.data,
    totalPages: response.data.totalPages,
    total: response.data.total,
  };
};

// 3. FAVORITES SERVICES
export const toggleFavoriteApi = async (videoId) => {
  const response = await api.post("/favorites", { videoId });
  return response.data;
};

export const fetchFavorites = async (page = 1, limit = 12) => {
  const response = await api.get("/favorites", {
    params: { page, limit },
  });
  return {
    items: response.data.data,
    totalPages: response.data.totalPages,
    total: response.data.total,
  };
};

// Check video status (favorite & watch later) for a single video
export const fetchVideoStatus = async (videoId) => {
  const response = await api.get(`/status/${videoId}`);
  return response.data;
};
