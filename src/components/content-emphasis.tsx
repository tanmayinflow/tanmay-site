/** Editorial emphasis only: exact substrings, no HTML parsing or copy rewriting.
 * Do not use for client quotations, legal text, metadata, headings or labels.
 * Case and original spaces (including NBSP) are preserved in every output node.
 */
const PHRASES = [
  'deseti let vlastní pohybové praxe', 'ten years of personal movement practice',
  '150+ klienty', '150+ clients', 'vedoucí studia a hlavní trenér',
  'Osobní trenér ve fitness', 'Personal Trainer in Fitness',
  'instruktorem jógy', 'yoga instructor',
  'studoval psychologii', 'studied psychology',
  'trénink s jasným směrem', 'jak podle reality upravit další krok',
  'bodyweight training and calisthenics', 'vlastní váha a kalistenika',
  'co má teď prioritu', 'what matters now',
  'Plán se přizpůsobuje realitě, ne naopak.',
  'svůj plán, termíny a záznamy na jednom místě',
  'svou praxi držet sám', 'run the practice yourself',
  'co chceš zvládnout', 'what you want to be able to do',
  's větším klidem', 'with greater calm',
  'Začínáš, vracíš se po pauze', 'You are starting, returning after a break',
  'Každý má vlastní úroveň', 'Everyone has their own level',
  'pravidelnou zpětnou vazbu', 'regular feedback',
  'většinu času hýbeme', 'spend most of the time moving',
  'jasnější obraz', 'a clearer picture',
  'podle skutečného průběhu', 'according to what actually happens',
  'záměr, opakování, záznam', 'intention, repetition, a record',
  'Většinu času se hýbeme.', 'Most of the time we move.',
  'varianty, kterou dokážeš provést čistě', 'a variation you can perform cleanly',
  'prostředky, ne cíl', 'means, not the goal',
  'který dokážeš skutečně ovládat', 'you can genuinely control',
  'zvolit další krok', 'choose the next step',
  'Nehoda není kvalifikace.', 'The accident is not a qualification.',
  'Není to příběh o nezranitelnosti.',
  'Plán nevnímám jako neměnný předpis.', 'I do not see a plan as a fixed prescription.',
  'Nenahrazuje ale plnohodnotnou fyzioterapii.',
  'It does not, however, replace full physiotherapy care.',
] as const;
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ \\u00a0]');
const PATTERN = new RegExp(PHRASES.slice().sort((a,b)=>b.length-a.length).map(escape).join('|'), 'g');
export function emphasizeCopy(text: string, options?: { maxMatches?: number; extraPhrases?: readonly string[] }) {
  const pattern = options?.extraPhrases?.length
    ? new RegExp([...PHRASES, ...options.extraPhrases].sort((a,b)=>b.length-a.length).map(escape).join('|'), 'g')
    : new RegExp(PATTERN.source, 'g');
  const ranges = Array.from(text.matchAll(pattern));
  if (!ranges.length) return text;
  // Longer credential paragraphs may carry several distinct facts. All others remain quiet.
  const limit = options?.maxMatches ?? (text.includes('150+') ? 5 : 2);
  const nodes = [];
  let cursor = 0;
  for (const item of ranges.slice(0, limit)) {
    const index = item.index!;
    nodes.push(text.slice(cursor, index));
    nodes.push(<strong className="copy-emphasis" key={index}>{item[0]}</strong>);
    cursor = index + item[0].length;
  }
  nodes.push(text.slice(cursor));
  return <>{nodes}</>;
}
