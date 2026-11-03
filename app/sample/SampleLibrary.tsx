"use client";

import { useEffect, useMemo, useState } from "react";

export type SampleVideo = {
  youtube_id: string;
  title: string;
  channel: string;
  duration?: string;
  kind: string;
  topics: string[];
  categories: string[];
  summary: string;
  why_hn_likes_it: string;
  score: number;
};

const ALL = "All";
const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
// YouTube's own thumbnails, hotlinked. Nothing is downloaded or hosted here.
const thumb = (id: string, size: "mqdefault" | "hqdefault") => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

function Reader({ video, rank, place }: { video: SampleVideo; rank: number; place: "pane" | "inline" }) {
  const titleId = `sl-reader-${place}-title`;
  return (
    <article className="sl-reader-card" aria-labelledby={titleId}>
      <div className="sl-reader-thumb">
        <img src={thumb(video.youtube_id, "hqdefault")} alt="" width={480} height={360} loading="lazy" referrerPolicy="no-referrer" />
      </div>
      <p className="sl-reader-meta">
        <span className="sl-kind">{video.kind}</span>
        <span>{video.channel}</span>
        {video.duration && <span>{video.duration}</span>}
      </p>
      <h3 id={titleId}>{video.title}</h3>
      <div className="sl-reader-foot">
        <a className="btn ghost" href={watchUrl(video.youtube_id)} target="_blank" rel="noreferrer">
          Open on YouTube<span className="sl-sr"> (opens in a new tab)</span>
        </a>
        <span className="sl-rank">#{rank} on HackerTube</span>
      </div>
      <section className="sl-reader-part">
        <h4>Summary</h4>
        <p>{video.summary}</p>
      </section>
      <section className="sl-reader-part sl-why">
        <h4>Why HN likes it</h4>
        <p>{video.why_hn_likes_it}</p>
      </section>
      <ul className="sl-cats" aria-label="Categories">
        {video.categories.map((name) => <li key={name}>{name}</li>)}
      </ul>
    </article>
  );
}

export function SampleLibrary({ videos }: { videos: SampleVideo[] }) {
  const [topic, setTopic] = useState(ALL);
  const [selected, setSelected] = useState(videos[0].youtube_id);

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const video of videos) for (const name of video.topics) counts.set(name, (counts.get(name) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [videos]);

  const ranks = useMemo(() => new Map(videos.map((video, index) => [video.youtube_id, index + 1])), [videos]);
  const shown = topic === ALL ? videos : videos.filter((video) => video.topics.includes(topic));
  const current = shown.find((video) => video.youtube_id === selected) ?? shown[0];

  // A link such as /sample#fNk_zzaMoSs opens that video.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!videos.some((video) => video.youtube_id === id)) return;
    setSelected(id);
    if (window.matchMedia("(max-width: 899px)").matches) {
      requestAnimationFrame(() => document.getElementById(`sl-card-${id}`)?.parentElement?.scrollIntoView({ block: "start" }));
    }
  }, [videos]);

  function choose(id: string) {
    setSelected(id);
    try { window.history.replaceState(null, "", `#${id}`); } catch { /* the address bar is optional */ }
  }

  return (
    <div className="sl-win">
      <div className="sl-bar">
        <h2 className="sl-bar-title">Library</h2>
        <span className="sl-tag">Sample</span>
        <span className="sl-count" aria-live="polite">{shown.length} {shown.length === 1 ? "video" : "videos"}</span>
      </div>
      <div className="sl-filters" role="group" aria-label="Filter by topic">
        {[[ALL, videos.length] as [string, number], ...topics].map(([name, count]) => (
          <button key={name} type="button" className="sl-chip" aria-pressed={topic === name} onClick={() => setTopic(name)}>
            {name} <span className="sl-chip-count">{count}</span>
          </button>
        ))}
      </div>
      <div className="sl-body">
        <ul className="sl-list" aria-label="Videos">
          {shown.map((video) => {
            const on = video.youtube_id === current.youtube_id;
            return (
              <li key={video.youtube_id} className={on ? "is-on" : undefined}>
                <button type="button" id={`sl-card-${video.youtube_id}`} className="sl-card" aria-pressed={on} onClick={() => choose(video.youtube_id)}>
                  <span className="sl-thumb">
                    <img src={thumb(video.youtube_id, "mqdefault")} alt="" width={320} height={180} loading="lazy" referrerPolicy="no-referrer" />
                  </span>
                  <span className="sl-card-body">
                    <span className="sl-card-title">{video.title}</span>
                    <span className="sl-card-channel">{video.channel}</span>
                    <span className="sl-card-state">
                      <span className="sl-kind">{video.kind}</span>
                      {video.topics.join(" · ")}
                    </span>
                  </span>
                </button>
                {on && (
                  <div className="sl-inline">
                    <Reader video={video} rank={ranks.get(video.youtube_id) ?? 0} place="inline" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <aside className="sl-pane" aria-label="Reader">
          <Reader video={current} rank={ranks.get(current.youtube_id) ?? 0} place="pane" />
        </aside>
      </div>
    </div>
  );
}
