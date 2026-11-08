import { previewText } from '../preview-copy';
import { routePath } from '../site.js';
import { mobilePreviewCopy } from '../mobile/PreviewDetails';
import { MobileVajra } from '../mobile/MobileVajra';

type ResponsiveHomeAboutProps = { lang: string; work?: boolean };

/** The approved portrait, introduction and story remain identical at every size. */
export function ResponsiveHomeAbout({ lang, work = false }: ResponsiveHomeAboutProps) {
  const c = (pair: readonly string[]) => previewText(pair, lang);
  const titleId = work ? 'responsive-work-about-title' : 'responsive-home-about-title';
  return <section className={'responsive-home-about' + (work ? ' responsive-home-about--work site-linen' : '')}
    id={work ? 'kdo-te-povede' : undefined} aria-labelledby={titleId}>
    <div className="wrap responsive-home-about__layout">
      <figure className="responsive-home-about__photo">
        <img src="/media/home-v9-5-1/about-prague-820.webp"
          srcSet="/media/home-v9-5-1/about-prague-360.webp 360w, /media/home-v9-5-1/about-prague-480.webp 480w, /media/home-v9-5-1/about-prague-720.webp 720w, /media/home-v9-5-1/about-prague-820.webp 820w"
          sizes="(min-width:1440px) 410px, (min-width:900px) 34vw, 80vw" width={820} height={1025}
          alt={lang === 'en' ? 'Profile portrait with Prague Castle in the background.' : 'Portrét z profilu s Pražským hradem v pozadí.'}
          loading="lazy" decoding="async"/>
      </figure>
      <div className="responsive-home-about__copy">
        <p className="responsive-home-about__name label">Kryštof Švec</p>
        <h2 className="h-display h2" id={titleId}>{c(mobilePreviewCopy.aboutTitle)}</h2>
        <p className="responsive-home-about__cheer">{c(mobilePreviewCopy.cheer)}</p>
        <MobileVajra className="responsive-coach-vajra"/>
        <p className="responsive-home-about__bio">{c(mobilePreviewCopy.bio)}</p>
        <a className="responsive-outline-action responsive-home-about__story" href={routePath('pribeh', lang)}>{c(mobilePreviewCopy.qualification)}</a>
      </div>
    </div>
  </section>;
}
