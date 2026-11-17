import ReviewVideoPlayer from "./ReviewVideoPlayer";
import "./review-video.css";
import ReviewVideoCarousel from "./ReviewVideoCarousel";
import OlgaReviewVideo from "./OlgaReviewVideo";
import MariaReviewVideo from "./MariaReviewVideo";
import BarboraReviewVideo from "./BarboraReviewVideo";

/** Supplied review; owner confirmed publication consent on 2026-11-10. */
export default function ReviewVideo({ lang = "cs" }: { lang?: string }) {
  const czech = lang !== "en";

  return (<ReviewVideoCarousel lang={lang} names={["Polin Kireccioglu", "Olga Malnichenko", "Maria Treibtich", "Barbora Čemusová"]}>
    <figure id="paulina-recenze" className="review-video-card">
      <figcaption className="review-video-caption">
        <span className="review-video-label">{czech ? "Video recenze" : "Video review"}</span>
        <span className="review-video-title">{czech ? "Polin Kireccioglu o spolupráci" : "Polin Kireccioglu on training together"}</span>
      </figcaption>
      <ReviewVideoPlayer name="Polin Kireccioglu" lang={lang} src="/media/reviews/paulina-recenze-titulky.mp4"
        poster="/media/reviews/paulina-poster-frame-2639.jpg" label={czech ? "Video recenze: Polin Kireccioglu, anglicky s českými titulky" : "Video review from client Polin Kireccioglu, in English with Czech subtitles"}/>
    </figure>
    <OlgaReviewVideo lang={lang}/>
    <MariaReviewVideo lang={lang}/>
    <BarboraReviewVideo lang={lang}/>
  </ReviewVideoCarousel>);
}
