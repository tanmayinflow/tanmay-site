import ReviewVideoPlayer from "./ReviewVideoPlayer";

/** Supplied review and clean owner-selected cover; consent confirmed 2026-11-17. */
export default function BarboraReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";

  return (
    <figure id="barbora-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Barbora Čemusová o spolupráci" : "Barbora Čemusová on training together"}</span>
      </figcaption>
      <ReviewVideoPlayer name="Barbora Čemusová" lang={lang} src="/media/reviews/barbora-recenze-titulky-en.mp4"
        poster="/media/reviews/barbora-poster-frame-417.jpg" label={czech ? "Video recenze: Barbora Čemusová" : "Video review: Barbora Čemusová"}/>
    </figure>
  );
}
