import { EducationDetail } from '../components/EducationDetails';
import { routePath } from '../site.js';
import { approvedLists } from './approved-content';
import { mobileText as t } from './mobile-copy';
import { copy, Chapter, Photo, Rail } from './MobileElements';
import { RichText } from './MobileRichText';
import { MobileHero } from './MobileShared';
import { MobileEditorialLink } from './MobileEditorialLink';
import MobileStoryTimeline from './MobileStoryTimeline';
import { MobileVajra } from './MobileVajra';

export default function MobileAbout({lang}:{lang:string}) {
  const c=(i:number)=>copy('PagePribeh',i,lang);
  const introduction=c(1).slice(c(1).indexOf('.')+1).trimStart();
  return <>
    <MobileHero page="about" lang={lang}/>
    <div id="mobilni-obsah" className="m-about-intro-copy"><div className="m-inner"><p><RichText>{introduction}</RichText></p><MobileEditorialLink href={routePath('spoluprace',lang)}>{lang==='en'?'Ways to work together':'Možnosti spolupráce'}</MobileEditorialLink></div></div>
    <Chapter title={c(9)} eyebrow={c(8)} className="m-roots"><p><RichText>{c(10)}</RichText></p><Rail title={c(9)} items={approvedLists.PagePribeh.roots} lang={lang}/></Chapter>
    <Chapter title={c(12)} eyebrow={c(11)} className="m-return m-dark">
      <p className="m-return-lead"><RichText>{c(13)}</RichText></p>
      <MobileStoryTimeline lang={lang}/>
      <p className="m-return-note"><RichText>{c(20)}</RichText></p>
    </Chapter>
    <Chapter title={c(21)} className="m-about-practice"><Photo asset="forest" alt={t('forestAlt',lang)} className="m-forest"/><div className="m-about-vajra-frame"><MobileVajra className="m-about-vajra"/></div><div className="m-editorial-stack">{approvedLists.PagePribeh.approach.map(r=><article key={r[0]}><h3><span className="m-approach-number">{r[0]}</span>{r[lang==='en'?3:1]}</h3><p><RichText>{r[lang==='en'?4:2]}</RichText></p></article>)}</div></Chapter>
    <Chapter title={c(23)} eyebrow={lang==='en'?'Professional education':'Odborné vzdělání'} className="m-education" id="vzdelani">
      <p><RichText>{c(24)}</RichText></p>
      <div className="m-education-columns">{[[25,29],[27,31]].map(column=><dl key={column[0]}>{column.map(i=><div key={i}><dt>{c(i)}</dt><dd><EducationDetail index={{25:0,27:1,29:2,31:3}[i]!} lang={lang}/></dd></div>)}</dl>)}</div>
        <p className="m-professional-boundary"><RichText>{c(33)}</RichText></p>
    </Chapter>
    <Chapter title={c(34)} className="m-offer"><p><RichText>{c(35)}</RichText></p><MobileEditorialLink href={routePath('spoluprace',lang)}>{lang==='en'?'Ways to work together':'Možnosti spolupráce'}</MobileEditorialLink></Chapter>
  </>;
}
