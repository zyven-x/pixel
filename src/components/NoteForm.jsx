import { useRef } from "react";
import { IoTrashOutline } from "react-icons/io5";

export default function NoteForm({
  mode,
  noteTitle,
  setNoteTitle,
  noteText,
  setNoteText,
  noteAttachment,
  setNoteAttachment,
  notes,
  selectedNoteIndex,
  handleSaveNote,
  handleUpdateNote,
  handleCancelNoteEdit,
  setNotes,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-bold">
        {mode === "edit-note" ? "Edit Note" : "Add New Note"}
      </h2>

      {/* Notes Title */}
      <input
        className="input"
        placeholder="Note Title"
        value={noteTitle}
        maxLength={40}
        onChange={(e) => setNoteTitle(e.target.value)}
      />

      {/* notes content */}
      <textarea
        className="input"
        rows="6"
        placeholder="Write a note..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />

      {/* img attachment */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setNoteAttachment(e.target.files[0])}
      />
      {(noteAttachment || notes[selectedNoteIndex]?.attachment) && (
        <div className="relative mt-2 group w-fit">
          <img
            src={
              noteAttachment
                ? URL.createObjectURL(noteAttachment)
                : notes[selectedNoteIndex]?.signedAttachment
            }
            alt="Attachment Preview"
            className="max-h-40 rounded border"
          />
          <button
            onClick={() => {
              setNoteAttachment(null);
              fileInputRef.current.value = "";
              if (selectedNoteIndex !== null) {
                const updatedNotes = [...notes];
                updatedNotes[selectedNoteIndex].attachment = null;
                setNotes(updatedNotes);
              }
            }}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            title="Remove image"
          >
            <IoTrashOutline className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* save & cancel stuff */}
      <div>
        <button
          className="btn-primary"
          onClick={mode === "edit-note" ? handleUpdateNote : handleSaveNote}
        >
          Save
        </button>
        {mode === "edit-note" && (
          <button className="btn-secondary mx-3" onClick={handleCancelNoteEdit}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
