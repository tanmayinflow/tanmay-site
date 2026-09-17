import { TRAINING_PRICES, formatTrainingPrice, type PricingLanguage } from './collaboration-pricing.data';
import './collaboration-faq.css';

/** Four native disclosure controls. Keyboard and no-JS HTML support are native.
 * Existing three answers are unchanged; the fourth uses the same price data as the table.
 * There is no invented cancellation rule, free trial, fixed frequency or refund promise.
 */
export default function CollaborationFaq({ lang = 'cs' }: { lang?: string }) {
  const language: PricingLanguage = lang === 'en' ? 'en' : 'cs';
  const t = (cs:string,en:string) => language === 'cs' ? cs : en;
  const single = TRAINING_PRICES.find(x => x.id === 'individual-single')!;
  const questions = [
    ['experience', t('Potřebuji zkušenosti?','Do I need experience?'), t('Ne. První setkání slouží i k tomu, abychom zjistili, kde právě jsi a co má smysl jako první.','No. The first session also helps us see where you are now and what makes sense as a first step.')],
    ['place', t('Kde probíhají osobní tréninky?','Where do in-person sessions take place?'), t('V Praze, uvnitř nebo venku podle toho, na čem pracujeme. Konkrétní místo domluvíme před prvním setkáním.','In Prague, indoors or outdoors depending on what we are working on. We agree the exact place before the first session.')],
    ['frequency', t('Jak často se budeme vídat?','How often will we meet?'), t('Frekvence není předem daná. U delší spolupráce ji nastavíme podle cíle, tvého týdne a toho, co budeš dělat mezi setkáními.','The frequency is not fixed in advance. In longer-term work we set it according to the goal, your week and what you will do between sessions.')],
    ['single', t('Můžu začít jedním tréninkem?','Can I start with a single session?'), t(`Ano. Jedno setkání může stát samo o sobě. Podíváme se na tvůj pohyb a podle potřeby zařadíme vstupní pohybovou diagnostiku. Odneseš si jasnější obraz o tom, co už funguje, jasné priority a konkrétní další krok. Trénink trvá ${single.minutes} minut a stojí ${formatTrainingPrice(single.priceCzk,language)}.`, `Yes. One session can stand on its own. We look at how you move and, as needed, include an initial movement assessment. You leave with a clearer picture of what already works, clear priorities and a concrete next step. The session lasts ${single.minutes} minutes and costs ${formatTrainingPrice(single.priceCzk,language)}.`)],
  ];
  return <section className="site-linen page-section collaboration-faq" id="otazky" aria-labelledby="collaboration-faq-title">
    <div className="wrap">
      <div className="faq-heading"><h2 className="h-display h2" id="collaboration-faq-title">{t('Časté otázky','Common questions')}</h2></div>
      <div className="faq-list">
        {questions.map(([id,question,answer]) => <details className="faq-item" key={id} data-faq-id={id} name="collaboration-questions">
          <summary><span>{question}</span><span className="faq-symbol" aria-hidden="true" /></summary>
          <div className="faq-answer"><p>{answer}</p>{id === 'single' && <a href="#cenik" className="faq-price-link">{t('Celý ceník','Full price list')} <span aria-hidden="true">↗</span></a>}</div>
        </details>)}
      </div>
    </div>
  </section>;
}
