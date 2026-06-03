import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchPlaylistDetails,
  updatePlaylistApi,
  deletePlaylistApi,
  removeVideoFromPlaylistApi,
} from "../services/playlistService";

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadPlaylist = async () => {
      try {
        setLoading(true);
        const data = await fetchPlaylistDetails(id);
        setPlaylist(data);
        setEditName(data.name);
        setEditDesc(data.description || "");
      } catch (err) {
        console.error("Failed to fetch playlist details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadPlaylist();
  }, [id, isAuthenticated, authLoading]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      setEditLoading(true);
      const updated = await updatePlaylistApi(id, editName.trim(), editDesc.trim());
      setPlaylist(prev => ({
        ...prev,
        name: updated.name,
        description: updated.description,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update playlist:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) return;
    try {
      await deletePlaylistApi(id);
      navigate("/library");
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  const handleRemoveVideo = async (e, videoId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeVideoFromPlaylistApi(id, videoId);
      setPlaylist(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v._id !== videoId),
      }));
    } catch (err) {
      console.error("Failed to remove video from playlist:", err);
    }
  };

  const handlePlayAll = () => {
    if (playlist && playlist.videos.length > 0) {
      // Play the first video in the playlist
      navigate(`/video/${playlist.videos[0]._id}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-zinc-400">
        <span className="text-5xl mb-4">📂</span>
        <h3 className="text-xl font-bold">Playlist Not Found</h3>
        <Link to="/library" className="mt-4 text-purple-400 hover:text-purple-300 font-bold text-sm">
          Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-100 font-sans pb-16">
      
      {/* Decorative blurred background from playlist's first video thumbnail */}
      {playlist.videos.length > 0 && playlist.videos[0].thumbnail?.high && (
        <div className="fixed inset-0 z-0">
          <img
            src={playlist.videos[0].thumbnail.high}
            className="w-full h-full object-cover opacity-5 blur-3xl scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-[#0f0f0f]/90" />
        </div>
      )}

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 lg:px-8 pt-8">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link to="/library" className="text-xs font-bold text-zinc-500 hover:text-purple-400 transition flex items-center gap-1">
            ← Back to Library
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Playlist metadata */}
          <div className="lg:col-span-4 bg-zinc-900/60 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            {/* Playlist Header Icon Layer */}
            <span className="absolute -bottom-10 -right-10 text-9xl opacity-[0.02] pointer-events-none select-none">📁</span>
            
            {!isEditing ? (
              <div>
                <h1 className="text-2xl font-extrabold text-white mb-2 leading-tight break-words">{playlist.name}</h1>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed whitespace-pre-wrap">{playlist.description || "No description provided."}</p>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/20 text-xs font-bold text-purple-400">
                      {playlist.videos.length} videos
                    </span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-zinc-500 text-xs">Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
                  </div>

                  {playlist.videos.length > 0 ? (
                    <button
                      onClick={handlePlayAll}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Play All
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-zinc-800 text-zinc-500 font-extrabold text-sm rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Empty Playlist
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="py-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-xs font-bold rounded-xl transition border border-white/5"
                    >
                      Edit Info
                    </button>
                    <button
                      onClick={handleDeletePlaylist}
                      className="py-2.5 bg-zinc-950 border border-red-500/20 hover:bg-red-950/30 hover:border-red-500 text-red-400 hover:text-white text-xs font-bold rounded-xl transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Edit Playlist Details</h3>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1 block">Playlist Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name..."
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1 block">Description</label>
                  <textarea
                    placeholder="Optional description..."
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(playlist.name);
                      setEditDesc(playlist.description || "");
                    }}
                    className="px-3.5 py-2 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs font-bold rounded-xl text-white transition shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Panel: Video listings */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-600 rounded-full" />
              Playlist Videos
            </h2>

            {playlist.videos.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-white/5 rounded-3xl p-6">
                <span className="text-4xl mb-3 block">📭</span>
                <h3 className="text-base font-bold text-zinc-400">This playlist has no videos</h3>
                <p className="text-zinc-600 text-xs mt-1">Browse videos on the home page and save them here.</p>
                <Link to="/" className="inline-block mt-4 px-5 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-xs font-bold rounded-xl text-purple-400 transition">
                  Browse Videos
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {playlist.videos.map((video, index) => (
                  <div
                    key={video._id}
                    className="group/item flex gap-4 p-3 bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-2xl hover:bg-zinc-900/50 transition cursor-pointer relative"
                  >
                    {/* Index Number */}
                    <div className="flex items-center justify-center w-6 text-xs text-zinc-500 font-extrabold select-none">
                      {index + 1}
                    </div>

                    <Link to={`/video/${video._id}`} className="flex gap-4 min-w-0 flex-1 flex-col md:flex-row">
                      {/* Video Thumbnail */}
                      <div className="w-full md:w-44 aspect-video rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                        <img
                          src={video.thumbnail?.high || video.thumbnail?.medium || ""}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition duration-500"
                        />
                      </div>
                      
                      {/* Video Details */}
                      <div className="flex-1 min-w-0 pr-10 flex flex-col justify-center">
                        <h3 className="text-sm font-bold text-zinc-100 group-hover/item:text-purple-400 transition line-clamp-2 leading-tight">
                          {video.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">{video.channelName}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{video.views?.toLocaleString()} views</p>
                      </div>
                    </Link>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleRemoveVideo(e, video._id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-full transition opacity-0 group-hover/item:opacity-100"
                      title="Remove from playlist"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
