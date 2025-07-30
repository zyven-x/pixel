import React from "react";
import { PiNotepad } from "react-icons/pi";

export default function Sidebar({
  activePanel,
  setActivePanel,
  setMode,
  setSelectedNoteIndex,
  setSelectedIndex,
  searchText,
  filteredNotes,
  filteredVault,
  notes,
  vault,
  selectedNoteIndex,
  selectedIndex,
}) {
  const itemsToShow =
    activePanel === "notes"
      ? searchText
        ? filteredNotes
        : notes
      : searchText
      ? filteredVault
      : vault;

  return (
    <div className="relative w-[40vw] border-r border-gray-200 bg-gray-100 p-4 overflow-y-auto rounded-tl-lg">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 px-4 py-2 text-sm font-semibold text-center transition ${
            activePanel === "vault"
              ? "bg-white border-b-2 border-black text-black rounded-t-lg z-10"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => {
            setActivePanel("vault");
            setMode("view");
            setSelectedNoteIndex(null);
          }}
        >
          Vault
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-semibold text-center transition ${
            activePanel === "notes"
              ? "bg-white border-b-2 border-black text-black rounded-t-lg z-10"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => {
            setActivePanel("notes");
            setMode("notes");
            setSelectedIndex(null);
          }}
        >
          Notes
        </button>
      </div>

      <div
        className={`bg-white pt-4 pb-4 pl-2 mt-[-16px] z-0 relative ${
          activePanel === "notes"
            ? "rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
            : "rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
        }`}
      >
        {itemsToShow.length === 0 ? (
          <div className="text-center text-sm text-gray-400 p-4">
            No results found
          </div>
        ) : (
          itemsToShow.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (activePanel === "notes") {
                  const originalIndex = notes.findIndex((n) => n.id === item.id);
                  setSelectedNoteIndex(originalIndex);
                  setMode("notes");
                } else {
                  const originalIndex = vault.findIndex((v) => v.id === item.id);
                  setSelectedIndex(originalIndex);
                  setMode("view");
                }
              }}
              className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                (activePanel === "notes" &&
                  notes[selectedNoteIndex]?.id === item.id) ||
                (activePanel !== "notes" &&
                  vault[selectedIndex]?.id === item.id)
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] bg-gray-300 rounded-full flex items-center justify-center text-sm overflow-hidden">
                  {activePanel === "notes" ? (
                    <PiNotepad />
                  ) : (
                    <img
                      src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}`}
                      className="w-4 h-4 object-contain"
                      alt="favicon"
                    />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="font-semibold text-sm truncate w-full">
                    {activePanel === "notes" ? item.title : item.site}
                  </div>
                  <div className="text-xs text-gray-500 truncate w-full">
                    {activePanel === "notes" ? "Encrypted note" : item.email}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
