import './practice-lsit-photo.css';

/** Owner-requested background extraction; the original photograph remains archived. */
export default function PracticeLsitPhoto({lang}:{lang:string}) {
  return <figure className="practice-lsit">
    <span className="practice-lsit-earth" aria-hidden="true"/>
    <div className="practice-lsit-crop">
      <img src="/media/practice-lsit-2026-11/lsit-profile-clean-20261113.webp" width={1634} height={1317}
        alt={lang==='en'?'Kryštof Švec holding an L-sit on a rock by the sea.':'Kryštof Švec drží L-sit na skále u moře.'}
        loading="eager" fetchPriority="high" decoding="async"/>
    </div>
  </figure>;
}
