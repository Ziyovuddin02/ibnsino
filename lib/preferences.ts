'use client';
import { useEffect, useState } from 'react';
import type { Lang } from './types';
export function usePreferences(){
 const [lang,setLang]=useState<Lang>('uz'),[dark,setDark]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{const l=localStorage.getItem('school-lang');if(l==='uz'||l==='ru'||l==='en')setLang(l);setDark(localStorage.getItem('school-dark')==='true');setReady(true);},[]);
 useEffect(()=>{if(ready){localStorage.setItem('school-lang',lang);localStorage.setItem('school-dark',String(dark));document.documentElement.lang=lang;document.documentElement.dataset.theme=dark?'dark':'light';}},[lang,dark,ready]);
 return {lang,setLang,dark,setDark};
}
