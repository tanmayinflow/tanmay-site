import '../components/collaboration-faq.css';

/** Mobile M10 keeps the approved FAQ wording, except the requested removal of
 * the final price/duration sentence. The locked desktop component is untouched. */
export default function MobileCollaborationFaq({ lang }: { lang: string }) {
  const t = (cs: string, en: string) => lang === 'en' ? en : cs;
  const questions = [
    ['experience', t('Potřebuji zkušenosti?', 'Do I need experience?'), t('Ne. První setkání slouží i k tomu, abychom zjistili, kde právě jsi a co má pro tebe smysl.', 'No. The first session also helps us see where you are now and what makes sense for you.')],
    ['place', t('Kde probíhají osobní tréninky?', 'Where do in-person sessions take place?'), t('V Praze, uvnitř nebo venku podle toho, na čem pracujeme. Konkrétní místo domluvíme před prvním setkáním.', 'In Prague, indoors or outdoors depending on what we are working on. We agree the exact place before the first session.')],
    ['frequency', t('Jak často se budeme vídat?', 'How often will we meet?'), t('Frekvence není předem daná. U delší spolupráce ji nastavíme podle cíle, tvého týdne a životního rytmu.', 'The frequency is not fixed in advance. In longer-term work we set it according to the goal, your week and the rhythm of your life.')],
    ['single', t('Můžu začít jedním tréninkem?', 'Can I start with a single session?'), t('Ano. Jedno setkání může stát samo o sobě. Podíváme se na tvůj pohyb a podle potřeby zařadíme vstupní pohybovou diagnostiku. Odneseš si jasnější obraz o tom, co už funguje, jasné priority a krok k pevnějšímu zdraví.', 'Yes. One session can stand on its own. We look at how you move and, as needed, include an initial movement assessment. You leave with a clearer picture of what already works, clear priorities and a step towards better health.')],
  ];
  return <section className="site-linen page-section collaboration-faq m-collaboration-faq" id="otazky" aria-labelledby="collaboration-faq-title">
    <div className="wrap">
      <div className="faq-heading"><h2 className="h-display h2" id="collaboration-faq-title">{t('Časté otázky', 'Common questions')}</h2></div>
      <div className="faq-list">{questions.map(([id, question, answer]) => <details className="faq-item" key={id} data-faq-id={id} name="collaboration-questions">
        <summary><span>{question}</span><span className="faq-symbol" aria-hidden="true" /></summary>
        <div className="faq-answer"><p>{answer}</p>{id === 'single' && <a href="#cenik" className="faq-price-link"><span className="m-faq-price-label">{t('Celý ceník', 'Full price list')}</span><span aria-hidden="true">↗</span></a>}</div>
      </details>)}</div>
    </div>
  </section>;
}
