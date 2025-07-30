import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  IoInformationCircle,
  IoAddCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { BiSolidEditAlt, BiSolidEdit } from "react-icons/bi";
import NoteContent from "./NoteContent";

export default function NoteViewer({
  selectedNote,
  selectedNoteIndex,
  setPreviewImage,
  showMoreInfo,
  setShowMoreInfo,
  masterKey,
  handleEditNote,
  handleDelete,
}) {
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!selectedNote?.attachment) return;

      const { data, error } = await supabase.storage
        .from("attachments")
        .createSignedUrl(selectedNote.attachment, 3600);

      if (!error && data?.signedUrl) {
        setPreviewImageUrl(data.signedUrl);
      }
    };

    fetchSignedUrl();
  }, [selectedNote]);

  if (!selectedNote) return null;

  return (
    <div className="max-w space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {selectedNote.title.length > 40
            ? selectedNote.title.slice(0, 40) + "..."
            : selectedNote.title}
        </h2>

        <div className="flex gap-2">
          <button className="btn-icon" onClick={handleEditNote}>
            <BiSolidEdit className="w-5 h-5" />
          </button>
          <button className="btn-icon" onClick={handleDelete}>
            <IoTrashOutline className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notes content */}
      <div className="bg-gray-200 p-4 rounded-lg whitespace-pre-wrap break-words">
        <NoteContent
          content={selectedNote.content}
          iv={selectedNote.iv}
          key={selectedNoteIndex}
          masterKey={masterKey}
        />
      </div>

      {/* img preview */}
      {selectedNote.attachment && previewImageUrl && (
        <div
          className="relative w-fit cursor-pointer"
          onClick={() => setPreviewImage(previewImageUrl)}
        >
          <img
            src={previewImageUrl}
            alt="Note attachment"
            className="rounded max-w-vw"
          />
        </div>
      )}

      {/* more info */}
      <div className="bg-gray-200 p-4 mt-4 rounded-lg">
        <div className="flex item-center gap-2 ">
          <span className="text-black/60 ml-2">
            <IoInformationCircle className="w-5 h-5" />
          </span>
          <div
            className="text-sm text-black/60 font-semibold mb-2 cursor-pointer"
            onClick={() => setShowMoreInfo(!showMoreInfo)}
          >
            More Info {showMoreInfo ? "▲" : "▼"}
          </div>
        </div>

        {showMoreInfo && (
          <>
            <div className="mb-2 mt-4">
              <div className="flex items-center gap-2 ml-2">
                <span className="text-black/60">
                  <BiSolidEditAlt className="w-5 h-5" />
                </span>
                <span className="text-sm text-gray-700 ml-2">
                  Last modified
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-11 mt-1">
                {new Date(selectedNote.updated).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2 ml-2">
                <span className="text-black/60">
                  <IoAddCircleOutline className="w-5 h-5" />
                </span>
                <span className="text-sm text-gray-700 ml-2">Created</span>
              </div>
              <div className="text-xs text-gray-500 ml-11 mt-1">
                {new Date(selectedNote.created).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
