import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import SortDropdown from "../components/SortDropdown";
import { searchVideos } from "../services/videoService";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = searchParams.get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const results = await searchVideos(query);

        if (results && results.length > 0) {
          setVideos(results);
        } else {
          setVideos([]);
          setError(`No results found for "${query}".`);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search videos. Please try again.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Sticky Header Bar */}
      <div className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </Link>

              <div className="h-6 w-px bg-gray-600"></div>

              <div>
                <h1 className="text-xl font-semibold">
                  {query ? `Results for "${query}"` : "Search"}
                </h1>
                <p className="text-sm text-gray-400">
                  {videos.length} {videos.length === 1 ? "video" : "videos"} found
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error / Warning Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-300">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8 pt-4">
        {videos.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No videos found</h2>
            <p className="text-gray-500 mb-6">Try searching with different keywords</p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              Browse All Videos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map((video, index) => (
              <VideoCard
                key={video._id || index}
                id={video._id}
                thumbnail={video.thumbnail?.high || video.thumbnail?.medium}
                title={video.title}
                channelName={video.channelName}
                views={video.views}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;