import media from "../content/family-media.json";

// Intentionally unmounted until the new heroes are approved.
export function SavedSourceCard({ id }: { id?: string }) {
  const source = media.savedSource;
  return (
    <div className="saved-source" id={id}>
      {/* Local manifest media keeps the reviewed crop unchanged. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={source.thumbnail} width={126} height={110} alt={source.thumbnailAlt} />
      <div className="source-meta">
        <strong>{source.title}</strong>
        <span>· {source.timestamp} · {source.status}</span>
      </div>
    </div>
  );
}
