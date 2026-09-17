import { useEffect, useState } from "react";

const ROOT = "/media/final-v9-13/";
const LOGO_ROOT = "/media/refine-v9-17/";
const ANCHOR_ROOT = "/media/refine-v9-17/";

/** Approved supplied outlines. A real transparent PNG is the fallback, not a substitute font. */
export function BrandWordmark() {
  const [format, setFormat] = useState<"webp" | "png" | "text">("webp");
  if (format === "text") return <span className="brand-fallback">tanmay</span>;
  return <span className="wm brand-wordmark" role="img" aria-label="tanmay">
    {(["ink", "linen"] as const).map(tone => <img key={`${tone}-${format}`} className={`brand-wordmark__${tone}`}
      src={LOGO_ROOT + `logo-${tone}-${format === "webp" ? "468.webp" : "native.png"}`}
      srcSet={format === "webp" ? `${LOGO_ROOT}logo-${tone}-234.webp 234w, ${LOGO_ROOT}logo-${tone}-468.webp 468w, ${LOGO_ROOT}logo-${tone}-934.webp 934w` : undefined}
      sizes="(min-width:600px) 220px, 184px" width={934} height={292} alt="" aria-hidden="true"
      decoding="async" loading="eager" onError={() => setFormat(format === "webp" ? "png" : "text")} />)}
  </span>;
}

/** Atomic mask activation: fallback stays visible until BOTH alpha layers decode successfully.
 * A missing CSS mask can never leave only floating text or a blank diagram.
 */
export function ThreeAnchorsArtwork({ lang }: { lang: string }) {
  const [raster, setRaster] = useState<"webp" | "png" | "failed">("webp");
  const [masks, setMasks] = useState<"pending" | "ready" | "failed">("pending");
  const cs = lang !== "en";
  useEffect(() => {
    let cancelled = false;
    const supported = typeof CSS !== "undefined" && (CSS.supports("mask-image", 'url("x.png")') || CSS.supports("-webkit-mask-image", 'url("x.png")'));
    if (!supported) { setMasks("failed"); return; }
    const images = ["anchors-strokes.png", "anchors-centre.png"].map(name => {
      const image = new Image();
      return new Promise<void>((resolve, reject) => {
        image.onload = () => image.decode().then(() => resolve(), reject);
        image.onerror = () => reject(new Error("Mask unavailable"));
        image.src = ROOT + name;
      });
    });
    Promise.all(images).then(() => { if (!cancelled) setMasks("ready"); }, () => { if (!cancelled) setMasks("failed"); });
    return () => { cancelled = true; };
  }, []);
  if (raster === "failed" && masks !== "ready") return null;
  return <figure className="enso-anchors" data-masks={masks} aria-label={cs
    ? "Tři rovnocenné kotvy: Tělo jako brána, Praxe jako most a Divoká příroda jako zrcadlo. Bod ve společném středu symbolizuje přítomnost."
    : "Three equal anchors: Body as gateway, Practice as bridge, and Wild nature as mirror. The dot at their shared centre symbolizes presence."}>
    <div className="enso-anchors__drawing">
    {raster !== "failed" && <img key={raster} className="enso-anchors__fallback"
      src={ANCHOR_ROOT + (raster === "webp" ? "anchors-720.webp" : "anchors-native.png")}
      srcSet={raster === "webp" ? `${ANCHOR_ROOT}anchors-360.webp 360w, ${ANCHOR_ROOT}anchors-540.webp 540w, ${ANCHOR_ROOT}anchors-720.webp 720w, ${ANCHOR_ROOT}anchors-960.webp 960w, ${ANCHOR_ROOT}anchors-1254.webp 1254w` : undefined}
      sizes="(min-width:900px) 450px, (min-width:600px) 430px, calc(100vw - 40px)"
      width={1254} height={1254} alt="" aria-hidden="true" loading="lazy" decoding="async"
      onError={() => setRaster(raster === "webp" ? "png" : "failed")} />}
    <span className="enso-anchors__strokes" aria-hidden="true" />
    <span className="enso-anchors__centre" aria-hidden="true" />
    <span className="enso-anchors__label enso-anchors__label--body"><strong>{cs ? "Tělo" : "Body"}</strong><small>{cs ? "Brána" : "Gateway"}</small></span>
    <span className="enso-anchors__label enso-anchors__label--practice"><strong>{cs ? "Praxe" : "Practice"}</strong><small>{cs ? "Most" : "Bridge"}</small></span>
    <span className="enso-anchors__label enso-anchors__label--nature"><strong>{cs ? <>Divoká<br />příroda</> : <>Wild<br />nature</>}</strong><small>{cs ? "Zrcadlo" : "Mirror"}</small></span>
    </div>
    <figcaption className="enso-anchors__legend">
      <span className="enso-anchors__legend-dot" aria-hidden="true" />
      <span className="enso-anchors__legend-separator" aria-hidden="true" />
      <span>{cs ? "Přítomnost" : "Presence"}</span>
    </figcaption>
  </figure>;
}

/** Approved Devanagari artwork. Text is accessible and also survives total image failure. */
export function TanmayCalligraphy() {
  const [format, setFormat] = useState<"webp" | "png" | "text">("webp");
  if (format === "text") return <span className="meaning-mark" lang="sa-Deva">तन्मय</span>;
  return <span className="tanmay-calligraphy" role="img" aria-label="तन्मय" lang="sa-Deva">
    <img key={format} src={ROOT + (format === "webp" ? "tanmay-devanagari-800.webp" : "tanmay-devanagari-native.png")}
      srcSet={format === "webp" ? `${ROOT}tanmay-devanagari-480.webp 480w, ${ROOT}tanmay-devanagari-800.webp 800w, ${ROOT}tanmay-devanagari-1200.webp 1200w, ${ROOT}tanmay-devanagari-1572.webp 1572w` : undefined}
      sizes="(min-width:1100px) 440px, (min-width:600px) 400px, calc(100vw - 40px)"
      width={1572} height={469} alt="" aria-hidden="true" loading="lazy" decoding="async"
      onError={() => setFormat(format === "webp" ? "png" : "text")} />
  </span>;
}
