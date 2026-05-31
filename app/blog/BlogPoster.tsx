export function BlogPoster({
  tone,
  size = "card",
  label,
  captionLeft,
  captionRight,
}: {
  tone: string;
  size?: "card" | "large";
  label?: string;
  captionLeft?: string;
  captionRight?: string;
}) {
  return (
    <div
      className={`blog-poster ${size === "large" ? "large" : ""} ${tone}`}
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      <span className="poster-photo" />
      <span className="poster-frame" />
      <span className="poster-device" />
      <span className="poster-card one" />
      <span className="poster-card two" />
      <span className="poster-card three" />
      <span className="poster-path" />
      <span className="poster-node a" />
      <span className="poster-node b" />
      <span className="poster-node c" />
      <span className="poster-stamp">{size === "large" ? "FIELD NOTES" : "UOINK"}</span>
      {captionLeft || captionRight ? (
        <div className="poster-caption">
          <span>{captionLeft}</span>
          <strong>{captionRight}</strong>
        </div>
      ) : null}
    </div>
  );
}
