import { useId } from "react";

/** Supplied review and clean owner-selected cover; consent confirmed 2026-11-16. */
export default function MariaReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";
  const videoId = useId();

  return (
    <figure id="maria-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Maria Treibtich o spolupráci" : "Maria Treibtich on training together"}</span>
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
          poster="/media/reviews/maria-poster-frame-268.jpg"
          aria-label={czech ? "Video recenze: Maria Treibtich" : "Video review: Maria Treibtich"}
        >
          <source src="/media/reviews/maria-recenze-titulky.mp4" type="video/mp4" />
          {czech ? "Tvůj prohlížeč nepodporuje přehrávání videa. " : "Your browser does not support video playback. "}
          <a href="/media/reviews/maria-recenze-titulky.mp4">
            {czech ? "Otevřít video recenzi: Maria Treibtich" : "Open video review: Maria Treibtich"}
          </a>
        </video>
      </div>
    </figure>
  );
}
