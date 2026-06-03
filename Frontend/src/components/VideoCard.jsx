import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ 
  id,
  thumbnail, 
  duration, 
  title, 
  channelName, 
  channelAvatar, 
  views, 
  timestamp, 
  isLive = false, 
  progress = 0 
}) => {

  return (
    <Link to={`/video/${id}`} className="group flex flex-col gap-3 cursor-pointer">
      
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-800">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        
        {isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
            <span className="material-symbols-outlined text-xs">sensors</span> LIVE
          </div>
        )}

     
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">
          {duration}
        </div>

        
        {progress > 0 && (
          <div 
            className="absolute bottom-0 left-0 h-1 bg-red-600" 
            style={{ width: `${progress}%` }}
          />
        )}
      </div>

  
      <div className="flex gap-3">
     
        <div className="size-10 shrink-0 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
          {channelAvatar && channelAvatar.startsWith('http') ? (
            <img src={channelAvatar} alt={channelName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-red-600 text-white font-bold text-sm">
              {channelName ? channelName.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2 mb-1 text-white">
            {title}
          </h3>
          <p className="text-xs text-zinc-400 font-medium">{channelName}</p>
          <p className="text-xs text-zinc-400">
            {isLive ? `${views} watching` : `${views} views`} • {timestamp}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;