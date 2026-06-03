import React, { useState, useRef, useEffect } from "react";

const sortOptions = [
  { value: "", label: "Relevance" },
  { value: "latest", label: "Latest" },
  { value: "views", label: "Most Viewed" },
];

const SortDropdown = ({ currentSort = "", onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || "Relevance";

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${isOpen
            ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
            : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20"
          }
        `}
      >
        {/* Sort Icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>

        <span>Sort: {currentLabel}</span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-48 py-1
          bg-[#1f1f1f] border border-white/10
          rounded-xl shadow-2xl shadow-black/50
          z-50
          animate-in fade-in slide-in-from-top-2
          overflow-hidden
        ">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2.5 text-sm
                transition-colors duration-150
                flex items-center justify-between
                ${option.value === currentSort
                  ? "bg-purple-600/20 text-purple-300"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <span>{option.label}</span>
              {option.value === currentSort && (
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
