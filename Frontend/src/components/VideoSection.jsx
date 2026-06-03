import React from "react";

import VideoCard from "./VideoCard";

const VideoSection = ({ videos, title }) => {

  return (
    <main className="
      flex-1
      overflow-y-auto
      pb-8
      px-4
      pt-4
      bg-[#0f0f0f]
      min-h-[50vh]
    ">

      {/* Optional Section Title */}
      {title && (
        <h2 className="text-white text-xl font-bold mb-5 flex items-center gap-2">
          {title}
        </h2>
      )}

      {/* Empty State */}
      {(!videos || videos.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="w-20 h-20 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No videos found</h3>
          <p className="text-sm text-zinc-500">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-x-4
          gap-y-8
          max-w-[1800px]
          mx-auto
        ">

          {videos.map((video, index) => (

            <VideoCard
              key={video._id || index}

              id={video._id}

              thumbnail={
                video.thumbnail?.high
              }

              title={video.title}

              channelName={
                video.channelName
              }

              views={video.views}
            />
          ))}

        </div>
      )}
    </main>
  );
};

export default VideoSection;