import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareModal from './ShareModal';
import { useAuth } from '../contexts/AuthContext';
import { addToHistory } from '../services/interactionService';
import InteractionButtons from './InteractionButtons';

function VideoPlayer({ videoId, contentType = 'video', contentData }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [speed, setSpeed] = useState(1);
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  
  useEffect(() => {
    if (isAuthenticated && contentData?._id) {
      const recordHistory = async () => {
        try {
          await addToHistory(contentData._id);
        } catch (err) {
          console.error("Failed to record watch history:", err);
        }
      };
      recordHistory();
    }
  }, [contentData?._id, isAuthenticated]);

  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/videos?limit=8&page=1`);
        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          const recs = json.data
            .filter(v => v.youtubeVideoId !== videoId) 
            .slice(0, 6)
            .map(v => ({
              id: v._id,
              youtubeVideoId: v.youtubeVideoId,
              title: v.title,
              thumbnail: v.thumbnail?.high || v.thumbnail?.medium || '',
              channelName: v.channelName,
              views: v.views?.toLocaleString() || '0',
            }));
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [videoId]);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const avatarLetter = contentData?.channelName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="w-full h-full bg-[#050505] text-slate-50 font-sans">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 p-4 lg:p-8">

        
        <div className="xl:col-span-8 space-y-6">

          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <iframe
                id="yt-player"
                className="w-full h-full"
                src={videoSrc}
                title="YouTube video player"
                frameBorder="0"
                allow="
    accelerometer;
    autoplay;
    clipboard-write;
    encrypted-media;
    gyroscope;
    picture-in-picture;
    web-share
  "
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          
          <div className="px-2">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white leading-tight">
              {contentData?.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-lg border border-white/10 overflow-hidden">
                  <span>{avatarLetter}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{contentData?.channelName}</h3>
                  <p className="text-sm text-zinc-400">{Number(contentData?.views)?.toLocaleString()} views</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {contentData?._id && (
                  <InteractionButtons
                    videoId={contentData._id}
                    videoTitle={contentData.title}
                  />
                )}

                <div className="flex items-center bg-zinc-900/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-5 py-2 hover:bg-white/10 rounded-full transition text-sm font-sans font-medium text-zinc-300"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>

            
            {contentData?.description && (
              <div className="mt-6 p-4 bg-zinc-900/40 rounded-2xl border border-white/5 text-sm leading-relaxed text-zinc-300">
                {contentData.description}
              </div>
            )}
          </div>
        </div>

        
        <div className="xl:col-span-4">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-purple-600 rounded-full" />
            Up Next
          </h2>

          {loadingRecommendations ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-3 p-2 rounded-2xl">
                  <div className="w-40 h-24 bg-zinc-800 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 bg-zinc-800 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <p className="text-zinc-500 text-sm">No recommendations available.</p>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={`${rec.id}-${index}`}
                  className="group flex gap-3 p-2 rounded-2xl hover:bg-white/5 transition border border-transparent hover:border-white/5 cursor-pointer"
                  onClick={() => navigate(`/video/${rec.id}`)}
                >
                  <div className="relative w-40 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800">
                    <img
                      src={rec.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      alt={rec.title}
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="font-bold text-sm line-clamp-2 text-zinc-100 group-hover:text-purple-400 transition">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">{rec.channelName}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{rec.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <ShareModal
        open={showShareModal}
        setOpen={setShowShareModal}
        videoUrl={currentUrl}
        videoTitle={contentData?.title}
      />
    </div>
  );
}

export default VideoPlayer;