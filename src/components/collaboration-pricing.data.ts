/** Owner-supplied prices, 2026-09-12. CZK only. No invented online rate or terms. */
export type PricingLanguage = "cs" | "en";
export type TrainingPrice = {
  id: string;
  label: Record<PricingLanguage, string>;
  minutes: number;
  priceCzk: number;
  perPerson: boolean;
  regular?: boolean;
};
export const TRAINING_PRICES: readonly TrainingPrice[] = [
  { id: "individual-single", label: { cs: "Individuální, jednorázově", en: "One-to-one, single session" }, minutes: 60, priceCzk: 1000, perPerson: false },
  { id: "individual-regular", label: { cs: "Individuální, pravidelná spolupráce", en: "One-to-one, regular training" }, minutes: 60, priceCzk: 800, perPerson: false, regular: true },
  { id: "pair", label: { cs: "Ve dvojici", en: "Training for two" }, minutes: 60, priceCzk: 600, perPerson: true },
  { id: "small-group", label: { cs: "Malá skupina, 3 až 6 osob", en: "Small group, 3 to 6 people" }, minutes: 75, priceCzk: 500, perPerson: true },
];
export const REGULAR_TRAINING = { minPrepaidSessions: 4, priceForFourCzk: 3200 } as const;
export function formatTrainingPrice(amount: number, language: PricingLanguage): string {
  const value = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return language === "cs" ? `${value}\u00a0Kč` : `CZK\u00a0${value}`;
}
