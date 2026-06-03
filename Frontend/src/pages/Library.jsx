import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchHistory,
  fetchWatchLater,
  fetchFavorites,
  clearAllHistory,
  removeHistoryItem,
  toggleFavoriteApi,
  toggleWatchLaterApi,
} from "../services/interactionService";
import {
  fetchPlaylists,
  createPlaylistApi,
  deletePlaylistApi,
} from "../services/playlistService";
import VideoCard from "../components/VideoCard";

const Library = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("favorites");
  
  
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  
  
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  
  const loadData = async (tab = activeTab, pageNum = 1) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      if (tab === "favorites") {
        const res = await fetchFavorites(pageNum, 12);
        setFavorites(res.items);
        setTotalPages(res.totalPages);
      } else if (tab === "watch-later") {
        const res = await fetchWatchLater(pageNum, 12);
        setWatchLater(res.items);
        setTotalPages(res.totalPages);
      } else if (tab === "history") {
        const res = await fetchHistory(pageNum, 12);
        setHistory(res.items);
        setTotalPages(res.totalPages);
      } else if (tab === "playlists") {
        const data = await fetchPlaylists();
        setPlaylists(data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(`Failed to load ${tab}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      
      navigate("/login");
    } else {
      loadData(activeTab, page);
    }
  }, [activeTab, page, isAuthenticated, authLoading]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  
  const handleRemoveFavorite = async (e, videoId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavoriteApi(videoId);
      setFavorites(prev => prev.filter(item => item.videoId._id !== videoId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const handleRemoveWatchLater = async (e, videoId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWatchLaterApi(videoId);
      setWatchLater(prev => prev.filter(item => item.videoId._id !== videoId));
    } catch (err) {
      console.error("Failed to remove watch later:", err);
    }
  };

  const handleRemoveHistory = async (e, historyId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeHistoryItem(historyId);
      setHistory(prev => prev.filter(item => item._id !== historyId));
    } catch (err) {
      console.error("Failed to remove history item:", err);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your entire watch history?")) return;
    try {
      await clearAllHistory();
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear watch history:", err);
    }
  };

  const handleDeletePlaylist = async (e, playlistId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      await deletePlaylistApi(playlistId);
      setPlaylists(prev => prev.filter(p => p._id !== playlistId));
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      setModalLoading(true);
      const res = await createPlaylistApi(newPlaylistName.trim(), newPlaylistDesc.trim());
      setPlaylists(prev => [res.data, ...prev]);
      setNewPlaylistName("");
      setNewPlaylistDesc("");
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
    } finally {
      setModalLoading(false);
    }
  };

  
  const formatWatchedTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Watched just now";
    if (diffMins < 60) return `Watched ${diffMins}m ago`;
    if (diffHours < 24) return `Watched ${diffHours}h ago`;
    if (diffDays === 1) return "Watched yesterday";
    return `Watched on ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-100 font-sans pb-16">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 pt-8">
        
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
              My Library
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage your history, playlists, liked videos, and watch list.
            </p>
          </div>
          
          {activeTab === "playlists" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center gap-1.5 self-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Create Playlist
            </button>
          )}

          {activeTab === "history" && history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-5 py-2.5 bg-zinc-900 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-sm rounded-xl transition flex items-center gap-1.5 self-start"
            >
              Clear Entire History
            </button>
          )}
        </div>

        
        <div className="flex border-b border-white/5 mb-8 overflow-x-auto hide-scrollbar gap-2">
          {[
            { id: "favorites", label: "Liked", icon: "♥" },
            { id: "watch-later", label: "Watch Later", icon: "⏰" },
            { id: "playlists", label: "Playlists", icon: "📁" },
            { id: "history", label: "History", icon: "🕒" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-purple-600 text-purple-400"
                  : "border-transparent text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-white/10 rounded-xl" />
                <div className="flex gap-3 mt-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            
            {activeTab === "favorites" && (
              favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4">🖤</span>
                  <h3 className="text-xl font-bold text-zinc-300">No Liked Videos</h3>
                  <p className="text-zinc-500 text-sm mt-1 max-w-xs">Explore content and tap Like to quickly save them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {favorites.map((item) => (
                    <div key={item._id} className="relative group/card">
                      <VideoCard id={item.videoId._id} thumbnail={item.videoId.thumbnail?.high} title={item.videoId.title} channelName={item.videoId.channelName} views={item.videoId.views} />
                      <button
                        onClick={(e) => handleRemoveFavorite(e, item.videoId._id)}
                        className="absolute top-2 right-2 p-2 bg-black/80 backdrop-blur-md hover:bg-red-600 rounded-full text-red-500 hover:text-white transition opacity-0 group-hover/card:opacity-100 shadow-lg border border-white/10"
                        title="Unlike video"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}

            
            {activeTab === "watch-later" && (
              watchLater.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4">⏰</span>
                  <h3 className="text-xl font-bold text-zinc-300">Your Watch Later is empty</h3>
                  <p className="text-zinc-500 text-sm mt-1 max-w-xs">Save interesting videos to watch them later whenever you want.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {watchLater.map((item) => (
                    <div key={item._id} className="relative group/card">
                      <VideoCard id={item.videoId._id} thumbnail={item.videoId.thumbnail?.high} title={item.videoId.title} channelName={item.videoId.channelName} views={item.videoId.views} />
                      <button
                        onClick={(e) => handleRemoveWatchLater(e, item.videoId._id)}
                        className="absolute top-2 right-2 p-2 bg-black/80 backdrop-blur-md hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition opacity-0 group-hover/card:opacity-100 shadow-lg border border-white/10"
                        title="Remove from Watch Later"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}

            
            {activeTab === "playlists" && (
              playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4">📂</span>
                  <h3 className="text-xl font-bold text-zinc-300">No Playlists yet</h3>
                  <p className="text-zinc-500 text-sm mt-1 max-w-xs">Create custom playlists to group your favorite collections.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {playlists.map((playlist) => (
                    <Link
                      to={`/playlists/${playlist._id}`}
                      key={playlist._id}
                      className="group p-5 bg-zinc-900/40 border border-white/5 rounded-2xl hover:border-purple-600/30 hover:bg-zinc-900/80 transition shadow-xl flex flex-col justify-between min-h-[160px] relative overflow-hidden"
                    >
                      
                      <span className="absolute -bottom-8 -right-8 text-8xl opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition duration-500">📁</span>
                      
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition truncate pr-6">{playlist.name}</h3>
                          <button
                            onClick={(e) => handleDeletePlaylist(e, playlist._id)}
                            className="text-zinc-500 hover:text-red-400 transition"
                            title="Delete playlist"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.842 10.519A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.74-2.533l.842-10.52.15.022a.75.75 0 10.23-1.482A41.802 41.802 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.587 7.402a.75.75 0 01.748.755l-.5 9a.75.75 0 01-1.495-.083l.5-9a.75.75 0 01.822-.672zm4.826.755a.75.75 0 00-1.496-.083l-.5 9a.75.75 0 101.495.083l.5-9z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">{playlist.description || "No description provided."}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/20 text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                          {playlist.videos.length} videos
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}

            
            {activeTab === "history" && (
              history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4">🕒</span>
                  <h3 className="text-xl font-bold text-zinc-300">Your watch history is clear</h3>
                  <p className="text-zinc-500 text-sm mt-1 max-w-xs">Start watching some amazing content to see them logged here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="group flex flex-col md:flex-row gap-4 p-3 bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-2xl hover:bg-zinc-900/50 transition cursor-pointer relative"
                      onClick={() => navigate(`/video/${item.videoId._id}`)}
                    >
                      
                      <div className="w-full md:w-56 aspect-video rounded-xl overflow-hidden bg-zinc-800 shrink-0 relative">
                        <img
                          src={item.videoId.thumbnail?.high || item.videoId.thumbnail?.medium || ""}
                          alt={item.videoId.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      
                      <div className="flex-1 min-w-0 pr-10 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-zinc-100 group-hover:text-purple-400 transition line-clamp-2 leading-tight">
                            {item.videoId.title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1">{item.videoId.channelName}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-4 text-[11px] font-medium text-zinc-500">
                          <span>{formatWatchedTime(item.watchedAt)}</span>
                          <span>•</span>
                          <span>{item.videoId.views?.toLocaleString()} views</span>
                        </div>
                      </div>

                      
                      <button
                        onClick={(e) => handleRemoveHistory(e, item._id)}
                        className="absolute right-4 top-4 p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition"
                        title="Remove from history"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}

            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs font-bold rounded-lg border border-white/5 text-zinc-300 hover:text-white transition"
                >
                  ◀ Previous
                </button>
                <span className="text-zinc-500 text-xs font-semibold">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs font-bold rounded-lg border border-white/5 text-zinc-300 hover:text-white transition"
                >
                  Next ▶
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-white mb-4">Create New Playlist</h3>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1 block">Playlist Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Tech Reviews, Chill Music..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1 block">Description</label>
                <textarea
                  placeholder="Optional description..."
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 hover:bg-zinc-800 rounded-xl text-sm font-semibold text-zinc-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-sm font-bold rounded-xl text-white transition shadow-lg shadow-purple-600/20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
