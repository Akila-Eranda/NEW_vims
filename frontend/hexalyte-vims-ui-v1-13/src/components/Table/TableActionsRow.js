import React, { useState, useRef, useEffect } from "react";

function TableActionsRow({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
        title="Actions"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-max">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setOpen(false); action.onClick(); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 hover:bg-gray-50 ${
                action.variant === "destructive"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TableActionsRow;
