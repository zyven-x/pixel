import React from "react";

export default function AddButton({ activePanel, setMode }) {
  return (
    <button
      className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 group cursor-pointer outline-none hover:rotate-90 duration-300"
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
  );
}
