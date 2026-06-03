import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search videos..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 bg-gray-800 text-white rounded-full border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
        <svg
          className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;