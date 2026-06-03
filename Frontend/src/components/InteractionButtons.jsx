import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchVideoStatus,
  toggleFavoriteApi,
  toggleWatchLaterApi,
} from "../services/interactionService";
import {
  fetchPlaylists,
  createPlaylistApi,
  addVideoToPlaylistApi,
  removeVideoFromPlaylistApi,
} from "../services/playlistService";

const InteractionButtons = ({ videoId, videoTitle }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !videoId) return;

    const loadStatuses = async () => {
      try {
        const statusData = await fetchVideoStatus(videoId);
        setIsFavorite(statusData.isFavorite);
        setIsWatchLater(statusData.isWatchLater);

        const playlistData = await fetchPlaylists();
        setPlaylists(playlistData);
      } catch (err) {
        console.error("Failed to load interaction statuses:", err);
      }
    };

    loadStatuses();
  }, [videoId, isAuthenticated]);

  // Click outside to close playlist dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPlaylistDropdown(false);
        setShowCreateForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const result = await toggleFavoriteApi(videoId);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleWatchLaterToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const result = await toggleWatchLaterApi(videoId);
      setIsWatchLater(result.isWatchLater);
    } catch (err) {
      console.error("Failed to toggle watch later:", err);
    }
  };

  const handlePlaylistClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowPlaylistDropdown(!showPlaylistDropdown);
    // Reload playlists dynamically
    try {
      const playlistData = await fetchPlaylists();
      setPlaylists(playlistData);
    } catch (err) {
      console.error("Failed to reload playlists:", err);
    }
  };

  const handlePlaylistToggle = async (playlist) => {
    const isAlreadyInPlaylist = playlist.videos.includes(videoId);
    try {
      if (isAlreadyInPlaylist) {
        await removeVideoFromPlaylistApi(playlist._id, videoId);
        setPlaylists(prev =>
          prev.map(p =>
            p._id === playlist._id
              ? { ...p, videos: p.videos.filter(id => id !== videoId) }
              : p
          )
        );
      } else {
        await addVideoToPlaylistApi(playlist._id, videoId);
        setPlaylists(prev =>
          prev.map(p =>
            p._id === playlist._id
              ? { ...p, videos: [...p.videos, videoId] }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to update playlist video:", err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      setLoading(true);
      const res = await createPlaylistApi(newPlaylistName.trim(), newPlaylistDesc.trim());
      const newPlaylist = res.data;
      
      // Automatically add current video to the newly created playlist
      await addVideoToPlaylistApi(newPlaylist._id, videoId);
      newPlaylist.videos.push(videoId);

      setPlaylists(prev => [newPlaylist, ...prev]);
      setNewPlaylistName("");
      setNewPlaylistDesc("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-full border border-white/5 backdrop-blur-md relative" ref={dropdownRef}>
      {/* Favorite / Like Button */}
      <button
        onClick={handleFavoriteToggle}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition duration-300 font-sans font-medium text-sm ${
          isFavorite
            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
            : "hover:bg-white/10 text-zinc-300"
        }`}
        title={isFavorite ? "Unlike video" : "Like video"}
      >
        <span className={isFavorite ? "text-white" : "text-purple-500"}>♥</span>
        <span>{isFavorite ? "Liked" : "Like"}</span>
      </button>

      <div className="w-px h-6 bg-white/10" />

      {/* Watch Later Button */}
      <button
        onClick={handleWatchLaterToggle}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition duration-300 font-sans font-medium text-sm ${
          isWatchLater
            ? "bg-zinc-800 text-purple-400 border border-purple-500/20"
            : "hover:bg-white/10 text-zinc-300"
        }`}
        title={isWatchLater ? "Remove from Watch Later" : "Save to Watch Later"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-purple-400">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        </svg>
        <span>{isWatchLater ? "Watch Later Saved" : "Watch Later"}</span>
      </button>

      <div className="w-px h-6 bg-white/10" />

      {/* Playlist Button */}
      <button
        onClick={handlePlaylistClick}
        className={`flex items-center gap-2 px-5 py-2 rounded-full hover:bg-white/10 transition duration-300 font-sans font-medium text-sm text-zinc-300 ${
          showPlaylistDropdown ? "bg-white/10 text-white" : ""
        }`}
        title="Add to Playlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-purple-400">
          <path fillRule="evenodd" d="M2.625 6A3.375 3.375 0 016 2.625h12A3.375 3.375 0 0121.375 6v12A3.375 3.375 0 0118 21.375H6A3.375 3.375 0 012.625 18V6zm6.25 2.125a.75.75 0 000 1.5h6.25a.75.75 0 000-1.5H8.875zm0 3.75a.75.75 0 000 1.5h6.25a.75.75 0 000-1.5H8.875zm0 3.75a.75.75 0 000 1.5h6.25a.75.75 0 000-1.5H8.875z" clipRule="evenodd" />
        </svg>
        <span>Save</span>
      </button>

      {/* Playlist Dropdown */}
      {showPlaylistDropdown && (
        <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-3 w-72 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 font-sans text-slate-100 backdrop-blur-xl bg-opacity-95">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
            <span>Save to...</span>
            <button
              onClick={() => setShowPlaylistDropdown(false)}
              className="text-zinc-500 hover:text-white"
            >
              ✕
            </button>
          </h4>

          {/* Playlist Choices */}
          <div className="max-h-48 overflow-y-auto space-y-2.5 mb-3 pr-1 hide-scrollbar">
            {playlists.length === 0 ? (
              <p className="text-zinc-500 text-xs italic py-2">No playlists created yet.</p>
            ) : (
              playlists.map((playlist) => {
                const inPlaylist = playlist.videos.includes(videoId);
                return (
                  <label
                    key={playlist._id}
                    className="flex items-center gap-3 px-2 py-1.5 hover:bg-white/5 rounded-lg cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={inPlaylist}
                      onChange={() => handlePlaylistToggle(playlist)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-zinc-700 bg-zinc-800"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-100 truncate">{playlist.name}</p>
                      <p className="text-[10px] text-zinc-500">{playlist.videos.length} videos</p>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Action to show Create Form */}
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-purple-400 hover:text-purple-300 transition flex items-center justify-center gap-1.5 border border-white/5"
            >
              + Create new playlist
            </button>
          ) : (
            <form onSubmit={handleCreatePlaylist} className="mt-3 pt-3 border-t border-white/5 space-y-2.5">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Description (optional)</label>
                <input
                  type="text"
                  placeholder="Enter description..."
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1.5 hover:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs font-bold rounded-lg text-white"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractionButtons;
