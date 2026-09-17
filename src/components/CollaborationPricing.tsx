import { TRAINING_PRICES, REGULAR_TRAINING, formatTrainingPrice, type PricingLanguage } from "./collaboration-pricing.data";
import "./collaboration-pricing.css";

/** A single price list on Spolupráce, adjacent to the approved formats.
 * No tier cards, hidden prices, subscriptions or unapproved contractual terms.
 */
export default function CollaborationPricing({ lang = "cs" }: { lang?: string }) {
  const language: PricingLanguage = lang === "en" ? "en" : "cs";
  const text = (cs: string, en: string) => language === "cs" ? cs : en;
  return (
    <section className="site-linen collaboration-pricing" id="cenik" aria-labelledby="training-prices-title">
      <div className="wrap">
        <div className="pricing-heading">
          <h2 className="h-display h2" id="training-prices-title">{text("Ceník", "Prices")}</h2>
        </div>
        <table className="training-prices" role="table" aria-labelledby="training-prices-title" aria-describedby="regular-training-terms">
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">{text("Trénink", "Training")}</th>
              <th scope="col" role="columnheader">{text("Délka", "Duration")}</th>
              <th scope="col" role="columnheader">{text("Cena za trénink", "Price per session")}</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {TRAINING_PRICES.map(item => (
              <tr key={item.id} role="row" data-price-id={item.id} className={item.regular ? "price-row-regular" : undefined}>
                <th scope="row" role="rowheader">
                  <span>{item.label[language]}</span>
                  {item.regular && <small>{text("Při předplacení", "When prepaid")}</small>}
                </th>
                <td className="price-duration" role="cell">{item.minutes}<span> {text("minut", "minutes")}</span></td>
                <td className="price-amount" role="cell">
                  <span className="price-value">{formatTrainingPrice(item.priceCzk, language)}</span>
                  {item.perPerson && <span className="price-unit">{text("za osobu", "per person")}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pricing-afterword">
          <p className="pricing-terms" id="regular-training-terms">
            {text("Zvýhodněná cena platí při předplacení alespoň ", "The reduced rate applies when you prepay for at least ")}
            <strong>{REGULAR_TRAINING.minPrepaidSessions}{text(" individuálních tréninků na měsíční období", " one-to-one sessions for a monthly period")}</strong>.
            {text(" Čtyři tréninky vyjdou na ", " Four sessions cost ")}
            <strong>{formatTrainingPrice(REGULAR_TRAINING.priceForFourCzk, language)}</strong>.
            {text(" Termíny domlouváme předem.", " We agree the dates and times in advance.")}
          </p>
          <a className="pricing-contact go" href="#kontakt">{text("Domluvit trénink", "Arrange a session")}<span className="arw" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
