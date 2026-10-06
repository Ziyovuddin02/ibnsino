'use client';
import { useState } from 'react';
import { LockKeyhole } from 'lucide-react';
export default function Login(){
 const [password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function login(event:React.FormEvent){event.preventDefault();setBusy(true);setError('');try{const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Kirish amalga oshmadi.');window.location.assign('/admin');}catch(error){setError(error instanceof Error?error.message:'Kirish amalga oshmadi.');setBusy(false);}}
 return <main className="admin-login"><form onSubmit={login}><img src="/images/school-logo.png" alt="Maktab logotipi" width={84} height={84}/><h1>Admin panel</h1><p>Abu Ali ibn Sino maktabi — Chinoz filiali</p><label><LockKeyhole size={18}/>Admin paroli<input type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="admin-message error" role="alert">{error}</p>}<button className="button primary" type="submit" disabled={busy}>{busy?'Kirilmoqda…':'Kirish'}</button><a href="/">Bosh sahifaga qaytish</a></form></main>;
}
