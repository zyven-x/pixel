import React from "react";
import { RxCross1 } from "react-icons/rx";

export default function SearchBar({ searchText, handleSearch }) {
  return (
    <div className="relative group z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      {/* Glow Effect */}
      <div className="absolute inset-0 glow-effect"></div>

      {/* Search Input */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/30 shadow-sm rounded-full relative z-10">
        {/* Search Icon */}
        <button onClick={() => handleSearch(searchText)}>
          <svg fill="none" viewBox="0 0 20 20" height="20px" width="20px">
            <path
              d="M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2z"
              fill="#333"
              fillRule="evenodd"
            />
          </svg>
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search with Security . . ."
          className="bg-transparent text-black placeholder-gray-700 outline-none flex-grow"
        />

        {/* Clear Button */}
        {searchText.length > 0 && (
          <button onClick={() => handleSearch("")}>
            <span className="text-gray-500 hover:text-black">
              <RxCross1 className="w-5 h-5" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
