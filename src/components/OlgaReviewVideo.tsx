import { useId } from "react";

/** Supplied review and clean owner-selected cover; consent confirmed 2026-11-16. */
export default function OlgaReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";
  const videoId = useId();

  return (
    <figure id="olga-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Olga Malnichenko o spolupráci" : "Olga Malnichenko on training together"}</span>
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
          poster="/media/reviews/olga-poster-frame-2705.jpg"
          aria-label={czech ? "Video recenze: Olga Malnichenko" : "Video review: Olga Malnichenko"}
        >
          <source src="/media/reviews/olga-recenze-titulky.mp4" type="video/mp4" />
          {czech ? "Tvůj prohlížeč nepodporuje přehrávání videa. " : "Your browser does not support video playback. "}
          <a href="/media/reviews/olga-recenze-titulky.mp4">
            {czech ? "Otevřít video recenzi: Olga Malnichenko" : "Open video review: Olga Malnichenko"}
          </a>
        </video>
      </div>
    </figure>
  );
}
