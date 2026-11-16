import { useId, useRef, useState } from "react";

export default function ReviewVideoPlayer({ name, src, poster, label, lang, cover = "" }: {
  name: string; src: string; poster: string; label: string; lang: string; cover?: string;
}) {
  const czech = lang !== "en";
  const uid = useId();
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const play = async () => {
    const player = video.current;
    if (!player) return;
    setFailed(false);
    setStarted(true);
    try {
      await player.play();
      requestAnimationFrame(() => player.focus({ preventScroll: true }));
    } catch {
      setStarted(false);
      setFailed(true);
    }
  };
  return <div className="review-video-player">
    <div className="review-video-stage" data-started={started}>
      <video ref={video} id={uid} className="review-video" controls={started} tabIndex={started ? 0 : -1}
        aria-hidden={!started ? true : undefined} playsInline preload="none" width={720} height={1280}
        poster={poster} aria-label={label} onPlay={() => setStarted(true)}
        onKeyDownCapture={event => {
          if (event.altKey || event.ctrlKey || event.metaKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          // Handle arrows before native controls: WebKit pans the ancestor and
          // Chromium's own seek can otherwise run alongside this one.
          event.preventDefault();
          event.stopPropagation();
          const player = event.currentTarget;
          if (Number.isFinite(player.duration)) player.currentTime = Math.max(0, Math.min(player.duration, player.currentTime + (event.key === "ArrowRight" ? 5 : -5)));
        }}>
        <source src={src} type="video/mp4" />
        {czech ? "Tvůj prohlížeč nepodporuje přehrávání videa. " : "Your browser does not support video playback. "}
        <a href={src}>{czech ? "Otevřít video recenzi: " : "Open video review: "}{name}</a>
      </video>
      {!started && <>
        <div className={"review-video-cover" + (cover ? " review-video-cover--" + cover : "")} aria-hidden="true"><img src={poster} alt="" width={720} height={1280}/></div>
        <button type="button" className="review-video-start" aria-controls={uid}
          aria-label={(czech ? "Přehrát recenzi: " : "Play review: ") + name} onClick={play}>
          <svg viewBox="0 0 16 18" width="14" height="16" aria-hidden="true"><path d="M2 1v16l13-8Z" fill="currentColor"/></svg>
          <span>{czech ? "Přehrát" : "Play"}</span>
        </button>
      </>}
    </div>
    {failed && <p className="review-video-error" role="alert">{czech ? "Video se nepodařilo spustit. Zkus to prosím znovu." : "The video could not start. Please try again."}</p>}
  </div>;
}
