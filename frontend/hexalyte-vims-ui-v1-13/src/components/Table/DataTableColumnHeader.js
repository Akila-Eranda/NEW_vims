import React from "react";

function DataTableColumnHeader({ column, title }) {
  if (!column.getCanSort()) {
    return <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>;
  }

  return (
    <button
      className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-800 transition-colors duration-150 group"
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <span className="ml-1">
        {column.getIsSorted() === "asc" ? (
          <svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        ) : column.getIsSorted() === "desc" ? (
          <svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 opacity-30 group-hover:opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default DataTableColumnHeader;
