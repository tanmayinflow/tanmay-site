import { emphasizeCopy } from '../components/content-emphasis';

// Locked desktop App.tsx: HomeAbout has a different editorial policy from
// ordinary paragraphs. Keep its complete, exact qualifications in both languages.
const HOME_CREDENTIAL_PHRASES = [
  'kondičního a funkčního tréninku', 'zdravotní tělesné výchovy', 'rehabilitačního tréninku',
  'studoval psychologii na Univerzitě Palackého',
  'studio manager and head trainer', 'conditioning and functional training', 'health-oriented physical education',
  'rehabilitation training', 'studied psychology at Palacký University',
] as const;

const EXPLICIT_EMPHASIS = [
  ['Vycházím z deseti let vlastní pohybové praxe', 'kondičním a funkčním tréninku, zdravotní tělesné výchově a rehabilitačním tréninku'],
  ['My work draws on ten years of personal movement practice', 'conditioning and functional training, health-oriented physical education and rehabilitation training'],
  ['Při delší spolupráci máš', 'klientské aplikaci'],
  ['In longer-term work,', 'client app'],
] as const;
const exactPhrase = (phrase: string) => new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ \\u00a0]'));

/** The desktop's editorial emphasis, applied to the same original mobile copy.
 * No HTML parsing, replacement copy or whitespace changes. In particular,
 * emphasizeCopy already recognises the Czech non-breaking spaces from copy().
 * Use for prose only, never review quotations, labels, headings or legal copy.
 */
export function RichText({ children }: { children: string }) {
  // These two desktop paragraphs contain an explicit JSX <strong> in addition
  // to emphasizeCopy. Match their context so e.g. Home's client-app paragraph
  // keeps its original emphasis on the plan, rather than gaining a new accent.
  const normalized = children.replace(/\u00a0/g, ' ');
  if (normalized.startsWith('Moje práce vyrostla z deseti let vlastní pohybové praxe') ||
      normalized.startsWith('My work grew from ten years of personal movement practice')) {
    return <>{emphasizeCopy(children, { maxMatches: 12, extraPhrases: HOME_CREDENTIAL_PHRASES })}</>;
  }
  const explicit = EXPLICIT_EMPHASIS.find(([prefix]) => normalized.startsWith(prefix));
  const match = explicit ? exactPhrase(explicit[1]).exec(children) : null;
  if (!match) return <>{emphasizeCopy(children)}</>;
  return <>{emphasizeCopy(children.slice(0, match.index))}<strong className="copy-emphasis">{match[0]}</strong>{children.slice(match.index + match[0].length)}</>;
}
