import { useId } from "react";
import "./review-video.css";

/** Supplied review; owner confirmed publication consent on 2026-11-10. */
export default function ReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";
  const videoId = useId();

  return (
    <figure id="paulina-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Paulina o spolupráci" : "Paulina on training together"}</span>
      </figcaption>
      <div className="review-video-player">
      <video
        id={videoId}
        className="review-video"
        controls
        tabIndex={0}
        playsInline
        preload="none"
        width={720}
        height={1280}
        poster="/media/reviews/paulina-recenze-titulky-poster.jpg"
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
      </div>
    </figure>
  );
}
