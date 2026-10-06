'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Lang } from '@/lib/types';
const elements=[
 {symbol:'H',number:1,names:{uz:'Vodorod',ru:'Водород',en:'Hydrogen'},color:'#40a8ff',type:'ripple',x:2,y:29,delay:-3},
 {symbol:'Na',number:11,names:{uz:'Natriy',ru:'Натрий',en:'Sodium'},color:'#ff9b35',type:'spark',x:92,y:37,delay:-12},
 {symbol:'K',number:19,names:{uz:'Kaliy',ru:'Калий',en:'Potassium'},color:'#ae83ff',type:'spiral',x:3,y:68,delay:-6},
 {symbol:'Mg',number:12,names:{uz:'Magniy',ru:'Магний',en:'Magnesium'},color:'#e6bf55',type:'flash',x:91,y:75,delay:-17},
 {symbol:'Li',number:3,names:{uz:'Litiy',ru:'Литий',en:'Lithium'},color:'#ff698c',type:'double',x:13,y:52,delay:-10},
 {symbol:'P',number:15,names:{uz:'Fosfor',ru:'Фосфор',en:'Phosphorus'},color:'#32cba6',type:'halo',x:82,y:59,delay:-21},
] as const;
const labels={uz:{pause:'Animatsiyani to‘xtatish',play:'Animatsiyani yoqish',click:'Chaqnash uchun bosing',animation:'Animatsiya'},ru:{pause:'Остановить анимацию',play:'Включить анимацию',click:'Нажмите для вспышки',animation:'Анимация'},en:{pause:'Pause animations',play:'Enable animations',click:'Click for a burst',animation:'Animation'}};
interface Burst {id:number;x:number;y:number;color:string;type:string;symbol:string;}
export default function ChemistryMotion({lang}:{lang:Lang}){
 const [paused,setPaused]=useState(false),[bursts,setBursts]=useState<Burst[]>([]),[hidden,setHidden]=useState<string[]>([]),[ready,setReady]=useState(false);
 const timers=useRef<Set<ReturnType<typeof setTimeout>>>(new Set()),counter=useRef(0);
 const t=labels[lang];
 useEffect(()=>{const pref=localStorage.getItem('school-motion');setPaused(pref==='paused'||(pref===null&&window.matchMedia('(prefers-reduced-motion: reduce)').matches));setReady(true);return()=>{timers.current.forEach(clearTimeout);document.documentElement.removeAttribute('data-motion');};},[]);
 useEffect(()=>{if(ready){document.documentElement.dataset.motion=paused?'paused':'active';localStorage.setItem('school-motion',paused?'paused':'active');}},[paused,ready]);
 function schedule(fn:()=>void,delay:number){const timer=setTimeout(()=>{timers.current.delete(timer);fn();},delay);timers.current.add(timer);}
 function react(element:typeof elements[number],button:HTMLButtonElement){if(hidden.includes(element.symbol))return;const rect=button.getBoundingClientRect(),id=++counter.current;setBursts(old=>[...old.slice(-5),{id,x:rect.left+rect.width/2,y:rect.top+rect.height/2,color:element.color,type:element.type,symbol:element.symbol}]);setHidden(old=>[...old,element.symbol]);schedule(()=>setBursts(old=>old.filter(b=>b.id!==id)),950);schedule(()=>setHidden(old=>old.filter(s=>s!==element.symbol)),1400);}
 return <><div className="chemistry-layer" role="group" aria-label={lang==='uz'?'Interaktiv kimyo elementlari':lang==='ru'?'Интерактивные химические элементы':'Interactive chemical elements'}>{elements.map((element,index)=><div key={element.symbol} className={'chem-drift chem-drift-'+index} style={{'--chem-x':element.x+'%','--chem-y':element.y+'%','--chem-delay':element.delay+'s','--chem-travel':(index%2===0?34:-34)+'px'} as CSSProperties}><button type="button" className={'chem-element '+(hidden.includes(element.symbol)?'reacted':'')} style={{'--chem-color':element.color} as CSSProperties} onClick={e=>react(element,e.currentTarget)} aria-label={`${element.names[lang]} (${element.symbol}). ${t.click}`} title={`${element.names[lang]} · ${t.click}`} disabled={hidden.includes(element.symbol)}><small>{element.number}</small><strong>{element.symbol}</strong><span>{element.names[lang]}</span></button></div>)}</div>
 <div className="chemistry-effects" aria-hidden="true">{bursts.map(b=><span key={b.id} className={'chem-burst burst-'+b.type} style={{left:b.x,top:b.y,'--burst-color':b.color} as CSSProperties}><span className="burst-core"/><span className="burst-ring"/><span className="burst-ring ring-second"/><span className="burst-symbol">{b.symbol}</span>{Array.from({length:b.type==='flash'?18:12},(_,i)=>{const angle=i*(Math.PI*2/(b.type==='flash'?18:12)),distance=38+(i%3)*13;return <i key={i} className="burst-particle" style={{'--spark-x':Math.cos(angle)*distance+'px','--spark-y':Math.sin(angle)*distance+'px','--spark-delay':(i%3)*25+'ms'} as CSSProperties}/>;})}</span>)}</div>
 <button className="motion-toggle" type="button" onClick={()=>setPaused(!paused)} aria-label={paused?t.play:t.pause} aria-pressed={!paused} title={paused?t.play:t.pause}>{paused?<Play size={17}/>:<Pause size={17}/>}<span>{t.animation}</span></button></>;
}
