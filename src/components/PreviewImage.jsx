export default function PreviewImage({ previewImage, setPreviewImage }) {
  if (!previewImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10"
      onClick={() => setPreviewImage(null)}
    >
      <img
        src={previewImage}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
      />
    </div>
  );
}
