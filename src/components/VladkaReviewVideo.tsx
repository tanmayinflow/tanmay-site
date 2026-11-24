import ReviewVideoPlayer from "./ReviewVideoPlayer";

/** Supplied review and clean owner-selected cover; consent confirmed 2026-11-24. */
export default function VladkaReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";

  return (
    <figure id="vladka-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Vladimíra Stuchlá o spolupráci" : "Vladimíra Stuchlá on training together"}</span>
      </figcaption>
      <ReviewVideoPlayer name="Vladimíra Stuchlá" lang={lang} src="/media/reviews/vladka-recenze-titulky-en.mp4"
        poster="/media/reviews/vladka-poster-frame-310.jpg" label={czech ? "Video recenze: Vladimíra Stuchlá" : "Video review: Vladimíra Stuchlá"}/>
    </figure>
  );
}
