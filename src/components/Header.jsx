import React from "react";
import Profile from "./Profile";
import { RxCross1 } from "react-icons/rx";

export default function Header({
  handleSearch,
  searchText,
  setSearchText,
  setMode,
  activePanel,
  profile,
  user,
  onEditUsername,
  onEditAvatar,
  onSignOut,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-gray-200 bg-white gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/Pixal_logo.png" className="ml-5 max-w-16" alt="logo" />
      </div>

      {/* Search Bar */}
      <div className="relative group z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
        <div className="absolute inset-0 glow-effect"></div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/30 shadow-sm rounded-full relative z-10">
          <button onClick={() => handleSearch(searchText)}>
            <svg fill="none" viewBox="0 0 20 20" height="20px" width="20px">
              <path
                d="M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2z"
                fill="#333"
                fillRule="evenodd"
              />
            </svg>
          </button>

          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search with Security . . ."
            className="bg-transparent text-black placeholder-gray-700 outline-none flex-grow"
          />

          {searchText.length > 0 && (
            <button onClick={() => handleSearch("")}>
              <span className="text-gray-500 hover:text-black">
                <RxCross1 className="w-5 h-5" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Add Button */}
      <button
        className="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={() => {
          if (activePanel === "notes") {
            setMode("add-note");
          } else {
            setMode("add");
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="currentColor"
          height="24"
          fill="none"
          className="svg"
        >
          <line y2="19" y1="5" x2="12" x1="12"></line>
          <line y2="12" y1="12" x2="19" x1="5"></line>
        </svg>
      </button>
      
      {/* Profile */}
      <Profile
        name={profile?.username || "Pixel User"}
        email={user?.email}
        avatar={profile?.avatar_url}
        onEditUsername={onEditUsername}
        onEditAvatar={onEditAvatar}
        onSignOut={onSignOut}
      />
    </div>
  );
}
