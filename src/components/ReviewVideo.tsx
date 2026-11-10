import { useId, useRef, useState } from "react";
import "./review-video.css";

/** Supplied review; owner confirmed publication consent on 2026-11-10. */
export default function ReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";
  const videoRef = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const videoId = useId();
  const [started, setStarted] = useState(false);

  return (
    <figure id="paulina-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Paulina o spolupráci" : "Paulina on training together"}</span>
        <span className="review-video-note">
          {czech ? "Anglicky s českými titulky" : "In English with Czech subtitles"}
          <span className="review-video-duration">2:44</span>
        </span>
      </figcaption>
      <div className="review-video-player">
      <video
        ref={videoRef}
        id={videoId}
        className="review-video"
        controls
        tabIndex={0}
        playsInline
        preload="none"
        width={720}
        height={1280}
        poster="/media/reviews/paulina-recenze-titulky-poster.jpg"
        onPlay={() => {
          const playButtonHadFocus = document.activeElement === playButtonRef.current;
          setStarted(true);
          if (playButtonHadFocus) videoRef.current?.focus({ preventScroll: true });
        }}
        onEnded={() => setStarted(false)}
        aria-label={czech
          ? "Video recenze klientky Pauliny, anglicky s českými titulky"
          : "Video review from client Paulina, in English with Czech subtitles"}
      >
        <source src="/media/reviews/paulina-recenze-titulky.mp4" type="video/mp4" />
        {czech ? "Tvůj prohlížeč nepodporuje přehrávání videa. " : "Your browser does not support video playback. "}
        <a href="/media/reviews/paulina-recenze-titulky.mp4">
          {czech ? "Otevřít video recenzi Pauliny" : "Open Paulina’s video review"}
        </a>
      </video>
      {!started && <button
        type="button"
        className="review-video-play"
        aria-controls={videoId}
        ref={playButtonRef}
        aria-label={czech ? "Přehrát video recenzi Pauliny" : "Play Paulina’s video review"}
        onClick={() => { void videoRef.current?.play().catch(() => { /* Native controls remain available. */ }); }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m8 5 11 7-11 7Z" fill="currentColor" /></svg>
        {czech ? "Přehrát" : "Play"}
      </button>}
      </div>
    </figure>
  );
}
