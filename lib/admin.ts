import { cookies } from 'next/headers';
import { SESSION_COOKIE, validSession } from './session';
export async function isAdmin(){return validSession((await cookies()).get(SESSION_COOKIE)?.value);}
export function sameOrigin(request:Request){const origin=request.headers.get('origin'),host=request.headers.get('x-forwarded-host')||request.headers.get('host');if(!origin||!host)return false;try{const parsed=new URL(origin);return ['http:','https:'].includes(parsed.protocol)&&parsed.origin===origin&&parsed.host===host;}catch{return false;}}
