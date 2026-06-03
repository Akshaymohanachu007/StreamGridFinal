import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-8">

      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200
          ${currentPage <= 1
            ? "bg-white/5 text-zinc-600 cursor-not-allowed"
            : "bg-white/10 text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/20"
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-purple-600 transition-all duration-200"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="text-zinc-500 px-1">···</span>
          )}
        </>
      )}

      
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-10 h-10 rounded-lg text-sm font-medium
            transition-all duration-200
            ${page === currentPage
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110"
              : "bg-white/10 text-white hover:bg-white/20"
            }
          `}
        >
          {page}
        </button>
      ))}

      
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="text-zinc-500 px-1">···</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-purple-600 transition-all duration-200"
          >
            {totalPages}
          </button>
        </>
      )}

      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200
          ${currentPage >= totalPages
            ? "bg-white/5 text-zinc-600 cursor-not-allowed"
            : "bg-white/10 text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/20"
          }
        `}
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
