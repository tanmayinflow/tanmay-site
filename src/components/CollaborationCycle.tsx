import { useState } from "react";

/** Approved three-arrow artwork, not a recreated symbol.
 * The adjacent copy explains the loop; the image is decorative.
 * PNG retries a failed WebP. Total failure removes the figure and its layout space. */
export default function CollaborationCycle() {
  const [format, setFormat] = useState<"webp" | "png" | "failed">("webp");
  if (format === "failed") return null;
  const root = "/media/refine-v9-19/cycle-linen-";
  return <figure className="collaboration-cycle-v919 rv" aria-hidden="true">
    <img key={format}
      src={root + (format === "webp" ? "300.webp" : "native.png")}
      srcSet={format === "webp" ? `${root}180.webp 180w, ${root}300.webp 300w, ${root}480.webp 480w, ${root}720.webp 720w, ${root}1036.webp 1036w` : undefined}
      sizes="(min-width:1100px) 150px, (min-width:900px) 130px, (min-width:600px) 150px, 120px"
      width={1036} height={1036} loading="lazy" decoding="async" alt=""
      onError={() => setFormat(format === "webp" ? "png" : "failed")} />
  </figure>;
}
