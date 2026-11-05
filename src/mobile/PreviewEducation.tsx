import './preview-education.css';

// Course hours transcribed from the owner's certificates on 5 November 2026.
// Each course reports its own scope; overlapping curricula are not added together.
export const mobileEducation = [
 {title:['Osobní trenér ve fitness','Personal trainer in fitness'],school:'Vital Institut',hours:150,theory:66,practice:84,url:'https://vitalinstitut.cz/trenersky-kurz/instruktor-fitness/'},
 {title:['Kondiční trenér','Conditioning trainer'],school:'Vital Institut',hours:150,theory:66,practice:84,url:'https://vitalinstitut.cz/trenersky-kurz/kondicni-trener/'},
 {title:['Funkční trenér','Functional trainer'],school:'Vital Institut',hours:150,theory:68,practice:82,url:'https://vitalinstitut.cz/trenersky-kurz/funkcni-trener/'},
 {title:['Rehabilitační trenér','Rehabilitation trainer'],school:'Vital Institut',hours:150,theory:68,practice:82,url:'https://vitalinstitut.cz/trenersky-kurz/rehabilitacni-trener/'},
 {title:['Instruktor jógy','Yoga instructor'],school:'Kabir Yoga',detail:['Dva výcviky, celkem 400 hodin.','Two training programmes, 400 hours in total.'],url:'https://kabiryoga.com/certifikovany-instruktorsky-kurz-jogy-yofyz-2020-osnova-a-podrobnosti/'},
 {title:['Studium psychologie','Psychology studies'],school:'Univerzita Palackého v Olomouci',detail:['2019–2024 · 5 let studia','2019–2024 · 5 years of study'],url:'https://psych.upol.cz/'}
] as const;

function Credential({index,lang}:{index:number;lang:string}) {
 const item=mobileEducation[index],n=lang==='en'?1:0;
 return <div className="preview-credential"><strong>{item.title[n]}</strong><span className="education-provider"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.school}</a></span><span className="education-duration">{'hours' in item?<><b>{item.hours} {n?'hours':'hodin'}</b><span className="education-hours-detail">{item.theory} {n?'theory':'teorie'} + {item.practice} {n?'practice':'praxe'}</span></>:item.detail[n]}</span></div>;
}

export function EducationDetail({index,lang}:{index:number;lang:string}) {
 return <>{[[0],[1,2,3],[4],[5]][index].map(i=><Credential key={i} index={i} lang={lang}/>)}</>;
}

export function EducationList({lang}:{lang:string}) {
 return <ul className="preview-education-list">{mobileEducation.map((item,i)=><li key={item.url}><Credential index={i} lang={lang}/></li>)}</ul>;
}
