import labels from "../../public/media/hero/labels.json";

// Intentionally unmounted until the new heroes are approved.
export function SavedSourceCard({ id }: { id?: string }) {
  const source = labels.example;
  return (
    <div className="saved-source" id={id}>
      <div className="source-meta">
        <strong>{source.savedTitle}</strong>
        <span>· {source.savedTimestamp} · {source.savedStatus}</span>
      </div>
    </div>
  );
}
