'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Award } from 'lucide-react';
import type { Lang, RecordItem } from '@/lib/types';
import { translations } from '@/lib/i18n';

function AnimatedCount({count,lang}:{count:number|null|undefined;lang:Lang}){
 const ref=useRef<HTMLSpanElement>(null),[value,setValue]=useState(count??0);
 useEffect(()=>{
  if(count==null)return;
  let frame=0;
  const node=ref.current;
  if(!node)return;
  const observer=new IntersectionObserver(entries=>{
   if(!entries.some(e=>e.isIntersecting))return;
   observer.disconnect();
   if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='paused'){setValue(count);return;}
   setValue(0);
   const start=performance.now();
   const tick=(now:number)=>{
    if(document.documentElement.dataset.motion==='paused'){setValue(count);return;}
    const progress=Math.min((now-start)/1300,1);
    setValue(Math.round(count*(1-Math.pow(1-progress,3))));
    if(progress<1)frame=requestAnimationFrame(tick);
   };
   frame=requestAnimationFrame(tick);
  },{threshold:.35});
  observer.observe(node);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);};
 },[count]);
 return <span ref={ref} className="certificate-count"><span aria-hidden="true">{count==null?'—':value.toLocaleString(lang==='uz'?'uz-UZ':lang==='ru'?'ru-RU':'en-GB')}</span><span className="sr-only">{count==null?translations[lang].certificatePending:String(count)}</span></span>;
}

export default function CertificateStatistics({records,lang}:{records:RecordItem[];lang:Lang}){
 const t=translations[lang];
 return <section id="certificates" className="section certificate-section"><div className="container"><div className="section-heading"><div><p className="eyebrow green">{t.certificateEyebrow}</p><h2>{t.certificates}</h2></div><Award className="certificate-heading-icon" size={46} aria-hidden="true"/></div><div className="certificate-grid">{records.map((item,index)=><article key={item.id} className="certificate-card" style={{'--card-delay':`${Math.min(index,8)*90}ms`} as CSSProperties}><span className="certificate-icon"><Award size={26} aria-hidden="true"/></span><h3>{item.title[lang]}</h3><AnimatedCount count={item.count} lang={lang}/><p>{item.count==null?t.certificatePending:t.certificateStudents}</p></article>)}</div>{records.length===0&&<p className="empty-state">{t.empty}</p>}</div></section>;
}
