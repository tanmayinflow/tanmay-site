// Owner's 29 October clarification + provider course descriptions.
// Provider averages are labelled explicitly; they are not personal attendance hours.
export const educationDetails = [
 {title:['Osobní trenér ve fitness','Personal trainer in fitness'],school:'Vital Institut',detail:['Kurz obvykle 2–3 měsíce; individuální tempo studia.','Course typically 2–3 months; individual study pace.'],url:'https://vitalinstitut.cz/trenersky-kurz/instruktor-fitness/'},
 {title:['Kondiční, funkční a rehabilitační trénink','Conditioning, functional and rehabilitation training'],school:'Vital Institut',detail:['Jednotlivé kurzy obvykle 2–3 měsíce; společný základ a specializační víkendy.','Individual courses typically 2–3 months; shared foundations and specialist weekends.'],url:'https://vitalinstitut.cz/trenersky-kurz/certifikat-master-trainer/'},
 {title:['Instruktor jógy','Yoga instructor'],school:'Kabir Yoga',detail:['Dva výcviky, celkem 400 hodin. Kurz Kabir Yoga: 200 hodin.','Two training programmes, 400 hours in total. Kabir Yoga course: 200 hours.'],url:'https://kabiryoga.com/certifikovany-instruktorsky-kurz-jogy-yofyz-2020-osnova-a-podrobnosti/'},
 {title:['Studium psychologie','Psychology studies'],school:'Univerzita Palackého v Olomouci',detail:['2019–2024 · 5 let studia','2019–2024 · 5 years of study'],url:'https://psych.upol.cz/'}
] as const;

export function EducationDetail({index,lang}:{index:number;lang:string}){
 const item=educationDetails[index],n=lang==='en'?1:0;
 return <><strong>{item.title[n]}</strong><span className="education-provider" style={{display:'block',marginTop:8,fontWeight:400}}><a href={item.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:'underline',textUnderlineOffset:'.2em'}}>{item.school}</a></span><span className="education-duration" style={{display:'block',marginTop:6,fontSize:'.9em',fontWeight:400,lineHeight:1.6}}>{item.detail[n]}</span></>;
}

export function EducationList({lang}:{lang:string}){
 return <ul className="preview-education-list" style={{listStyle:'none',padding:0,margin:0}}>{educationDetails.map((item,i)=><li key={item.school+i} style={{marginBottom:28}}><EducationDetail index={i} lang={lang}/></li>)}</ul>;
}
