import { useEffect, useRef } from "react";
import { TerrainArtwork } from "./TerrainArtwork";

/** Real selectable copy, with the approved curve sized to the longest rendered text line.
 * Font loading, translation and viewport changes are measured, never estimated in characters.
 * The statement and its 100%-width underline remain visible before JS measurements complete.
 */
export default function ReflectionStatement({ text }: { text: string }) {
  // Keep the short concluding sentence together on narrow screens; wording is unchanged.
  const statementText = text.replace(/^(.*?\.)\s+(.+)$/, (_, first: string, second: string) => first + " " + second.replace(/ /g, "\u00a0"));
  const root = useRef<HTMLSpanElement>(null);
  const copy = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const box = root.current;
    const content = copy.current;
    if (!box || !content) return;
    let frame = 0;
    let active = true;
    const measure = () => {
      if (!active) return;
      const range = document.createRange();
      range.selectNodeContents(content);
      const rects = Array.from(range.getClientRects()).filter(r => r.width > 0);
      // A single text node supplies one rectangle per actual line, including translated copy.
      const width = Math.min(box.getBoundingClientRect().width, Math.max(0, ...rects.map(r => r.width)));
      if (width > 0) box.style.setProperty("--reflection-text-width", `${width.toFixed(2)}px`);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(box);
    window.addEventListener("resize", schedule);
    document.fonts?.addEventListener("loadingdone", schedule);
    document.fonts?.ready.then(() => { if (active) schedule(); });
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
      document.fonts?.removeEventListener("loadingdone", schedule);
    };
  }, [text]);
  return <p className="reflection-closing rv d2">
    <span className="reflection-statement" ref={root}>
      <span className="reflection-statement__text" ref={copy}>{statementText}</span>
      <span className="reflection-statement__underline" aria-hidden="true">
        <TerrainArtwork variant="l02" compact />
      </span>
    </span>
  </p>;
}
