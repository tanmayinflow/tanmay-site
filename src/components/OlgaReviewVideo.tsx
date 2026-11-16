import ReviewVideoPlayer from "./ReviewVideoPlayer";

/** Supplied review and clean owner-selected cover; consent confirmed 2026-11-16. */
export default function OlgaReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";

  return (
    <figure id="olga-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Olga Malnichenko o spolupráci" : "Olga Malnichenko on training together"}</span>
      </figcaption>
      <ReviewVideoPlayer name="Olga Malnichenko" lang={lang} src="/media/reviews/olga-recenze-titulky.mp4"
        poster="/media/reviews/olga-poster-frame-2705.jpg" label={czech ? "Video recenze: Olga Malnichenko" : "Video review: Olga Malnichenko"} cover="olga"/>
    </figure>
  );
}
