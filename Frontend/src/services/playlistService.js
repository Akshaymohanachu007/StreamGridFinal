import api from "../lib/api";

// Create a new playlist
export const createPlaylistApi = async (name, description = "") => {
  const response = await api.post("/playlists", { name, description });
  return response.data;
};

// Fetch all playlists belonging to the user
export const fetchPlaylists = async () => {
  const response = await api.get("/playlists");
  return response.data.data;
};

// Get playlist details with populated videos
export const fetchPlaylistDetails = async (playlistId) => {
  const response = await api.get(`/playlists/${playlistId}`);
  return response.data.data;
};

// Update playlist details
export const updatePlaylistApi = async (playlistId, name, description = "") => {
  const response = await api.put(`/playlists/${playlistId}`, { name, description });
  return response.data.data;
};

// Delete a playlist
export const deletePlaylistApi = async (playlistId) => {
  const response = await api.delete(`/playlists/${playlistId}`);
  return response.data;
};

// Add a video to a playlist
export const addVideoToPlaylistApi = async (playlistId, videoId) => {
  const response = await api.post(`/playlists/${playlistId}/videos`, { videoId });
  return response.data;
};

// Remove a video from a playlist
export const removeVideoFromPlaylistApi = async (playlistId, videoId) => {
  const response = await api.delete(`/playlists/${playlistId}/videos/${videoId}`);
  return response.data;
};
