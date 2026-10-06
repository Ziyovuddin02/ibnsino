'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, GraduationCap } from 'lucide-react';
import { translations } from '@/lib/i18n';
import type { Lang, RecordItem } from '@/lib/types';

export default function MediaDialog({selected,photos,lang,onSelect,onDismiss}:{selected:RecordItem|null;photos:RecordItem[];lang:Lang;onSelect:(item:RecordItem)=>void;onDismiss:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),touch=useRef<{x:number;y:number}|null>(null);
 const [closing,setClosing]=useState(false),[direction,setDirection]=useState('forward'),[imageState,setImageState]=useState<'loading'|'ready'|'error'>('loading');
 const t=translations[lang],isOpen=selected!==null;
 const index=selected?.kind==='gallery'?photos.findIndex(p=>p.id===selected.id):-1;
 const canNavigate=index>=0&&photos.length>1;
 useEffect(()=>{
  const node=dialog.current;if(!node)return;
  if(!isOpen)return;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  node.showModal();
  return()=>{document.body.style.overflow=overflow;if(node.open)node.close();};
 },[isOpen]);
 useEffect(()=>{setClosing(false);setImageState('loading');if(timer.current)clearTimeout(timer.current);dialog.current?.scrollTo({top:0});},[selected?.id]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 function close(){
  if(closing)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='paused'){onDismiss();return;}
  setClosing(true);timer.current=setTimeout(onDismiss,190);
 }
 function move(step:number){if(!canNavigate||closing)return;setDirection(step<0?'backward':'forward');onSelect(photos[(index+step+photos.length)%photos.length]);}
 const date=selected?.date?new Date(selected.date+'T12:00:00').toLocaleDateString(lang==='uz'?'uz-UZ':lang==='ru'?'ru-RU':'en-GB',{day:'numeric',month:'long',year:'numeric'}):'';
 return <dialog ref={dialog} aria-labelledby="media-dialog-title" className={'content-dialog media-dialog '+(selected?.kind==='gallery'?'photo-dialog ':'')+(closing?'is-closing':'')} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(canNavigate&&e.key==='ArrowRight'){e.preventDefault();move(1);}if(canNavigate&&e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
  <button className="dialog-close icon-button" type="button" onClick={close} aria-label={t.close} autoFocus><X size={22}/></button>
  {selected&&<article key={selected.id} className={'dialog-scene scene-'+direction}>
   {selected.image&&<div className={'detail-image-frame image-'+imageState} onPointerDown={e=>{if(e.pointerType==='touch')touch.current={x:e.clientX,y:e.clientY};}} onPointerUp={e=>{const start=touch.current;touch.current=null;if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);}} onPointerCancel={()=>{touch.current=null;}}>
    {imageState==='loading'&&<span className="image-loader" role="status"><span/>{t.loading}</span>}
    {imageState==='error'?<p className="detail-image-error">{t.imageUnavailable}</p>:<img src={selected.image} alt={selected.title[lang]} onLoad={()=>setImageState('ready')} onError={()=>setImageState('error')}/>}
   </div>}
   <div className="dialog-copy">{canNavigate&&<div className="gallery-controls"><button type="button" onClick={()=>move(-1)} aria-label={t.previousPhoto}><ChevronLeft size={22}/></button><span aria-live="polite">{index+1} / {photos.length}</span><button type="button" onClick={()=>move(1)} aria-label={t.nextPhoto}><ChevronRight size={22}/></button></div>}{date&&<p className="metadata">{date}</p>}<h2 id="media-dialog-title">{selected.title[lang]}</h2>{selected.university[lang]&&<h3 className="detail-university"><GraduationCap size={20}/>{selected.university[lang]}</h3>}{selected.body[lang]&&<p className="preserve-lines">{selected.body[lang]}</p>}</div>
  </article>}
 </dialog>;
}
