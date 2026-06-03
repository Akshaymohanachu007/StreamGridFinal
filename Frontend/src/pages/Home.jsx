import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import CategoryScrollingbar
  from "../components/CategoryScrollingbar";

import VideoSection
  from "../components/VideoSection";

import TrendingSection
  from "../components/TrendingSection";

import SortDropdown
  from "../components/SortDropdown";

import Pagination
  from "../components/Pagination";

import {
  fetchVideos,
} from "../services/videoService";

import RecommendedVideos
  from "../components/RecommendedVideos";

function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);

      const result = await fetchVideos({
        page,
        limit: 12,
        sort,
      });

      setVideos(result.videos);
      setTotalPages(result.totalPages);

    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, sort]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1); // Reset to page 1 when sort changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen">

      {/* Category Bar */}
      <CategoryScrollingbar />

      {/* Trending Section */}
      <TrendingSection />

      {/* Divider */}
      <div className="px-4">
        <div className="h-px bg-white/5" />
      </div>

      <div className="px-4 py-6 max-w-[1800px] mx-auto">

        <RecommendedVideos />

      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 max-w-[1800px] mx-auto">
        <h2 className="text-white text-lg font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          All Videos
        </h2>

        <SortDropdown
          currentSort={sort}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="px-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 max-w-[1800px] mx-auto">
            {[...Array(12)].map((_, i) => (
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
        </div>
      ) : (
        <VideoSection videos={videos} />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="bg-[#0f0f0f] pb-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

    </div>
  );
}

export default Home;