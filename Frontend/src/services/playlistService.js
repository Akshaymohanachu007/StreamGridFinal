import api from "../lib/api";

export const createPlaylistApi = async (name, description = "") => {
  const response = await api.post("/playlists", { name, description });
  return response.data;
};

export const fetchPlaylists = async () => {
  const response = await api.get("/playlists");
  return response.data.data;
};

export const fetchPlaylistDetails = async (playlistId) => {
  const response = await api.get(`/playlists/${playlistId}`);
  return response.data.data;
};

export const updatePlaylistApi = async (playlistId, name, description = "") => {
  const response = await api.put(`/playlists/${playlistId}`, { name, description });
  return response.data.data;
};

export const deletePlaylistApi = async (playlistId) => {
  const response = await api.delete(`/playlists/${playlistId}`);
  return response.data;
};

export const addVideoToPlaylistApi = async (playlistId, videoId) => {
  const response = await api.post(`/playlists/${playlistId}/videos`, { videoId });
  return response.data;
};

export const removeVideoFromPlaylistApi = async (playlistId, videoId) => {
  const response = await api.delete(`/playlists/${playlistId}/videos/${videoId}`);
  return response.data;
};
