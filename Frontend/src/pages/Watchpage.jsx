import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';


function Watchpage() {
  const location = useLocation();
  const { id } = useParams();
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const state = location.state;

        // TV Show or Movie passed via router state (not from our DB)
        if (state?.isTVShow && state?.showData) {
          setVideoData(state.showData);
          setYoutubeVideoId(id);
        } else if (state?.isMovie && state?.movieData) {
          setVideoData(state.movieData);
          const match = state.movieData.trailerUrl?.match(/v=([^&]+)/);
          setYoutubeVideoId(match ? match[1] : '');
        } else if (id) {
          // Fetch video from our backend by MongoDB _id
          const response = await fetch(`http://localhost:5000/api/videos/${id}`);
          const json = await response.json();

          if (json.success && json.data) {
            const video = json.data;
            setVideoData(video);
            // Use the actual YouTube video ID stored in our DB
            setYoutubeVideoId(video.youtubeVideoId);
          } else {
            setError('Video not found');
          }
        } else {
          setError('No content available');
        }
      } catch (err) {
        console.error('Failed to load video:', err);
        setError('Connection failed');
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [id, location]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">

      {/* Blurred background from video thumbnail */}
      {videoData?.thumbnail?.high && (
        <div className="fixed inset-0 z-0">
          <img
            src={videoData.thumbnail.high}
            className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>
      )}

      <div className="relative z-10">
        <main className="px-0 lg:px-12 pb-20">
          <div className="w-full overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-y lg:border lg:rounded-3xl border-white/5 bg-black">
            {youtubeVideoId ? (
              <VideoPlayer
                videoId={youtubeVideoId}
                contentType={location.state?.isTVShow ? 'tvshow' : location.state?.isMovie ? 'movie' : location.state?.isGame ? 'game' : 'video'}
                contentData={videoData}
              />
            ) : (
              <div className="aspect-video flex flex-col items-center justify-center gap-4 text-zinc-500">
                <div className="text-4xl">🎬</div>
                <p className="italic font-medium">Video unavailable</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Watchpage;