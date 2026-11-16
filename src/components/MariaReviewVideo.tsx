import ReviewVideoPlayer from "./ReviewVideoPlayer";

/** Supplied review and clean owner-selected cover; consent confirmed 2026-11-16. */
export default function MariaReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";

  return (
    <figure id="maria-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Maria Treibtich o spolupráci" : "Maria Treibtich on training together"}</span>
      </figcaption>
      <ReviewVideoPlayer name="Maria Treibtich" lang={lang} src="/media/reviews/maria-recenze-titulky.mp4"
        poster="/media/reviews/maria-poster-frame-268.jpg" label={czech ? "Video recenze: Maria Treibtich" : "Video review: Maria Treibtich"}/>
    </figure>
  );
}
