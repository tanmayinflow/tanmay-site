import './preview-education.css';

// Course hours transcribed from the owner's certificates on 5 November 2026.
// Each course reports its own scope; overlapping curricula are not added together.
export const mobileEducation = [
 {title:['Osobní trenér ve fitness','Personal trainer in fitness'],school:'Vital Institut',hours:150,theory:66,practice:84,url:'https://vitalinstitut.cz/trenersky-kurz/instruktor-fitness/'},
 {title:['Kondiční trenér','Conditioning trainer'],school:'Vital Institut',hours:150,theory:66,practice:84,url:'https://vitalinstitut.cz/trenersky-kurz/kondicni-trener/'},
 {title:['Funkční trenér','Functional trainer'],school:'Vital Institut',hours:150,theory:68,practice:82,url:'https://vitalinstitut.cz/trenersky-kurz/funkcni-trener/'},
 {title:['Rehabilitační trenér','Rehabilitation trainer'],school:'Vital Institut',hours:150,theory:68,practice:82,url:'https://vitalinstitut.cz/trenersky-kurz/rehabilitacni-trener/'},
 {title:['Instruktor jógy','Yoga instructor'],school:'Kabir Yoga',detail:['Celkem 400 hodin.','400 hours in total.'],url:'https://kabiryoga.com/certifikovany-instruktorsky-kurz-jogy-yofyz-2020-osnova-a-podrobnosti/'},
 {title:['Studium psychologie','Psychology studies'],school:'Univerzita Palackého v Olomouci',detail:['2019–2024 · 5 let studia','2019–2024 · 5 years of study'],url:'https://psych.upol.cz/'}
] as const;

function Credential({index,lang}:{index:number;lang:string}) {
 const item=mobileEducation[index],n=lang==='en'?1:0;
 return <div className="preview-credential"><strong>{item.title[n]}</strong><span className="education-provider"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.school}</a></span><span className="education-duration">{'hours' in item?<b>{item.hours} {n?'hours':'hodin'}</b>:item.detail[n]}</span></div>;
}

/** The same grouping is used on the story and collaboration pages. */
export function EducationColumns({lang}:{lang:string}) {
 const n=lang==='en'?1:0;
 const groups=[
  [{title:['Profesní kvalifikace','Professional qualification'],items:[0]},{title:['Jóga','Yoga'],items:[4]},{title:['Studium','Studies'],items:[5]}],
  [{title:['Pohyb a trénink','Movement and training'],items:[1,2,3]}],
 ];
 return <div className="preview-education-columns">{groups.map((column,i)=><div className="preview-education-column" key={i}>{column.map(group=><section className="preview-education-group" key={group.title[0]}><h3>{group.title[n]}</h3>{group.items.map(index=><Credential key={index} index={index} lang={lang}/>)}</section>)}</div>)}</div>;
}
export function EducationList({lang}:{lang:string}) {return <EducationColumns lang={lang}/>;}
