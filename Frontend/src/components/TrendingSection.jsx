import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchTrendingVideos } from "../services/videoService";

const TrendingSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrendingVideos();
        setVideos(data);
      } catch (error) {
        console.error("Failed to load trending videos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [videos]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-48 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72">
              <div className="aspect-video bg-white/10 rounded-xl animate-pulse" />
              <div className="mt-3 h-4 w-3/4 bg-white/10 rounded animate-pulse" />
              <div className="mt-2 h-3 w-1/2 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <div className="px-4 py-6 relative">

      
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
          <span className="text-lg">🔥</span>
          <h2 className="text-sm font-bold text-orange-300 uppercase tracking-wider">
            Trending Now
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-orange-500/30 to-transparent" />
      </div>

      
      <div className="relative group">

        
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="
              absolute left-0 top-0 bottom-0 z-10 w-12
              bg-gradient-to-r from-[#0f0f0f] to-transparent
              flex items-center justify-start pl-1
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
          >
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}

        
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="
              absolute right-0 top-0 bottom-0 z-10 w-12
              bg-gradient-to-l from-[#0f0f0f] to-transparent
              flex items-center justify-end pr-1
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
          >
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-2"
        >
          {videos.map((video, index) => (
            <Link
              to={`/video/${video._id}`}
              key={video._id || index}
              className="flex-shrink-0 w-72 group/card"
            >
              
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                <img
                  src={video.thumbnail?.high || video.thumbnail?.medium || ""}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-orange-500/30">
                  <span className="text-orange-400 text-xs font-bold">#{index + 1}</span>
                </div>

                
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-xs text-white font-medium">
                  {video.views?.toLocaleString() || 0} views
                </div>
              </div>

              
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover/card:text-purple-300 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 font-medium">
                  {video.channelName || "Unknown Channel"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
