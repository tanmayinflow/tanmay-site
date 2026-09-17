import type { ReactNode } from 'react';

/** The desktop Go treatment, with a mobile-sized touch target. */
export function MobileEditorialLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="m-editorial-link" href={href}><span>{children}</span><span className="m-editorial-link-arrow" aria-hidden="true">→</span></a>;
}
