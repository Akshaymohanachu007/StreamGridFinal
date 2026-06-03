import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useParams }
  from "react-router-dom";

import VideoSection
  from "../components/VideoSection";

import CategoryScrollingbar
  from "../components/CategoryScrollingbar";

import SortDropdown
  from "../components/SortDropdown";

import Pagination
  from "../components/Pagination";

import {
  fetchVideos,
} from "../services/videoService";


function CategoryPage() {

  const { slug } = useParams();

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
        category: slug,
      });

      setVideos(result.videos);
      setTotalPages(result.totalPages);

    } catch (error) {
      console.error("Failed to load category videos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, sort, slug]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
    setSort("");
  }, [slug]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format category name from slug
  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-[#0f0f0f] min-h-screen">

      {/* Category Bar */}
      <CategoryScrollingbar />

      {/* Category Header + Sort */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 max-w-[1800px] mx-auto">
        <div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-3">
            {categoryName}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Browse videos in {categoryName.toLowerCase()}
          </p>
        </div>

        <SortDropdown
          currentSort={sort}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="px-4 pb-8 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 max-w-[1800px] mx-auto">
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

export default CategoryPage;