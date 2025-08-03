"use client";
import React from "react";

export default function Pagination({ 
  className, 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  itemsPerPage = 6,
  totalItems = 0
}) {
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, 5, ..., last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={className ? className : "pagination justify-content-center"}
    >
      {/* Previous Page Button */}
      <a
        onClick={() => handlePageChange(currentPage - 1)}
        className={currentPage === 1 ? "disabled" : ""}
        style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
      >
        <i className="mi-chevron-left" />
        <span className="visually-hidden">Previous page</span>
      </a>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="no-active">...</span>
          ) : (
            <a
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </a>
          )}
        </React.Fragment>
      ))}

      {/* Next Page Button */}
      <a
        onClick={() => handlePageChange(currentPage + 1)}
        className={currentPage === totalPages ? "disabled" : ""}
        style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
      >
        <i className="mi-chevron-right" />
        <span className="visually-hidden">Next page</span>
      </a>
    </div>
  );
}
