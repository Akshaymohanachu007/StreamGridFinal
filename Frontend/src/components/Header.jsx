import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';
import VoiceSearch from './VoiceSearch';

const Header = () => {

  const { user, logout, isAuthenticated } = useAuth();
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?u=user");
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  const handleVoiceSearch = () => {
    setIsVoiceSearchOpen(true);
  };

  const handleVoiceSearchClose = () => {
    setIsVoiceSearchOpen(false);
  };

  const handleVoiceSearchResult = (query) => {
    handleSearch(query);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('userProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  return (
    <header className="flex items-center justify-between bg-black px-4 py-2 text-white sticky top-0 z-50 shadow-md font-sans">

      <div className="flex items-center space-x-4 flex-shrink-0">
        <Link to="/" className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white pl-0.5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold tracking-tight hidden sm:inline">
            Stream<span className="text-purple-500">Grid</span>
          </span>
        </Link>
      </div>

      
      <div className="flex flex-grow justify-center items-center mx-2 sm:mx-4 lg:mx-10 max-w-2xl">
        <div className="flex-grow">
          <SearchBar onSearch={handleSearch} placeholder="Search..." />
        </div>

        
        <button
          onClick={handleVoiceSearch}
          className="ml-2 p-2.5 bg-[#1f1f1f] hover:bg-[#3f3f3f] rounded-full transition-colors flex-shrink-0"
          title="Search with your voice"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white" focusable="false">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zM17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-2 relative">

        
        {!isAuthenticated && (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}

        
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="p-1 bg-[#1f1f1f] hover:bg-[#3f3f3f] rounded-full transition-colors flex items-center gap-2 pr-3"
              title="User Profile"
            >
              <img
                src={profileImage}
                alt="User Profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
              <span className="text-sm font-medium hidden sm:inline">{user?.username}</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-white/10 mb-2">
                  <p className="text-sm font-bold truncate">{user?.username}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/library"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  My Library
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-white/5 mt-1 pt-2"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isVoiceSearchOpen && (
        <VoiceSearch
          isOpen={isVoiceSearchOpen}
          onClose={handleVoiceSearchClose}
          onSearch={handleVoiceSearchResult}
        />
      )}

    </header>
  );
};

export default Header;