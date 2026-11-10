import { previewText } from '../preview-copy';
import { mobilePreviewCopy } from '../mobile/PreviewDetails';
import { routePath } from '../site.js';

type ResponsiveHomeProcessProps = { lang: string; work?: boolean };

function ProcessConnector({ reverse }: { reverse: boolean }) {
  return <svg className={'responsive-home-process__connector' + (reverse ? ' responsive-home-process__connector--reverse' : '')}
    viewBox="0 0 92 64" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 10 C37 7 35 45 80 45" strokeDasharray="4 7"/>
      <path d="M69 37 L81 45 L70 52"/>
  </svg>;
}

/** Desktop uses the same reviewed steps as the mobile layout. */
export function ResponsiveHomeProcess({ lang, work = false }: ResponsiveHomeProcessProps) {
  const c = (pair: readonly string[]) => previewText(pair, lang);
  const steps = work ? mobilePreviewCopy.workSteps : mobilePreviewCopy.steps;
  const titleId = work ? 'responsive-work-process-title' : 'responsive-home-process-title';
  return <section className={'responsive-home-process' + (work ? ' responsive-home-process--work site-linen' : '')}
    id={work ? 'jak-zacit' : 'jak-to-funguje'} aria-labelledby={titleId}>
    <div className="wrap">
      <h2 className="h-display h2" id={titleId}>{work ? (lang === 'en' ? 'How do you start?' : 'Jak začneš?') : c(mobilePreviewCopy.howTitle)}</h2>
      <ol className="responsive-home-process__steps">
        {steps.map((step, index) => <li key={step[0][0]}>
          <h3><span className="responsive-home-process__number" aria-hidden="true">0{index + 1}</span><span>{c(step[0])}</span></h3>
          <p>{c(step[1])}</p>
          {index < steps.length - 1 && <ProcessConnector reverse={index === 1}/>}
        </li>)}
      </ol>
      <div className="responsive-home-process__actions">
        <a className="responsive-outline-action" href={work ? '#kontakt' : '#rezervace'}>{lang === 'en' ? 'I want to start' : 'Chci začít'}</a>
        {!work && <a className="responsive-home-process__detail" href={routePath('spoluprace', lang) + '#co-dostanes'}>
          {lang === 'en' ? 'What exactly you get' : 'Co přesně dostaneš'}<span aria-hidden="true">→</span>
        </a>}
      </div>
    </div>
  </section>;
}
