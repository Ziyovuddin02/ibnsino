import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
export const SESSION_COOKIE='sino_admin_session';
export const SESSION_SECONDS=8*60*60;
export function configured(){return (process.env.ADMIN_PASSWORD?.length??0)>=12&&(process.env.SESSION_SECRET?.length??0)>=32;}
function key(){if(!configured())throw new Error('Admin authentication is not configured');return createHmac('sha256',process.env.SESSION_SECRET!).update(process.env.ADMIN_PASSWORD!).digest();}
export function passwordMatches(value:string){if(!configured())return false;const digest=(text:string)=>createHash('sha256').update(text).digest();return timingSafeEqual(digest(value),digest(process.env.ADMIN_PASSWORD!));}
export function createSession(now=Date.now()){const payload=Buffer.from(JSON.stringify({exp:Math.floor(now/1000)+SESSION_SECONDS,nonce:randomBytes(16).toString('hex')})).toString('base64url');return payload+'.'+createHmac('sha256',key()).update(payload).digest('base64url');}
export function validSession(token:string|undefined,now=Date.now()){
 if(!token||!configured()||token.length>500)return false;
 try{const parts=token.split('.');if(parts.length!==2)return false;const [payload,signature]=parts;const expected=createHmac('sha256',key()).update(payload).digest();const received=Buffer.from(signature,'base64url');if(received.length!==expected.length||!timingSafeEqual(expected,received))return false;const value=JSON.parse(Buffer.from(payload,'base64url').toString());return typeof value.nonce==='string'&&typeof value.exp==='number'&&value.exp>Math.floor(now/1000)&&value.exp<=Math.floor(now/1000)+SESSION_SECONDS;}catch{return false;}
}
