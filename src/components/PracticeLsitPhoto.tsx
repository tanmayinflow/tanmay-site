import './practice-lsit-photo.css';

/** Owner's original photo: the crop is CSS-only, with no retouching of the person. */
export default function PracticeLsitPhoto({lang}:{lang:string}) {
  return <figure className="practice-lsit">
    <span className="practice-lsit-layer practice-lsit-copper-layer" aria-hidden="true">
      <span className="practice-lsit-material practice-lsit-copper"/>
    </span>
    <span className="practice-lsit-layer practice-lsit-ink-layer" aria-hidden="true">
      <span className="practice-lsit-material practice-lsit-ink"/>
    </span>
    <div className="practice-lsit-crop">
      <img src="/media/practice-lsit-2026-11/praxe-original.jpg" width={960} height={1280}
        alt={lang==='en'?'Kryštof Švec holding an L-sit on a rock by the sea.':'Kryštof Švec drží L-sit na skále u moře.'}
        loading="eager" fetchPriority="high" decoding="async"/>
    </div>
  </figure>;
}
