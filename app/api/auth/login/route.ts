import { cookies } from 'next/headers';
import { configured, createSession, passwordMatches, SESSION_COOKIE, SESSION_SECONDS } from '@/lib/session';
import { sameOrigin } from '@/lib/admin';
import { claimLoginAttempt } from '@/lib/storage';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Kirishga ruxsat yo‘q.'},{status:403});
 if(!configured())return Response.json({error:'Netlify sozlamalarida ADMIN_PASSWORD va SESSION_SECRET ni kiriting.'},{status:503});
 if(Number(request.headers.get('content-length')||0)>4096)return Response.json({error:'So‘rov juda katta.'},{status:413});
 try{if(!await claimLoginAttempt())return Response.json({error:'Urinishlar ko‘p bo‘ldi. 5 daqiqadan keyin qayta urinib ko‘ring.'},{status:429,headers:{'Retry-After':'300'}});const data=await request.json();if(typeof data.password!=='string'||data.password.length>256||!passwordMatches(data.password))return Response.json({error:'Parol noto‘g‘ri.'},{status:401});(await cookies()).set(SESSION_COOKIE,createSession(),{httpOnly:true,secure:new URL(request.headers.get('origin')!).protocol==='https:',sameSite:'strict',path:'/',maxAge:SESSION_SECONDS});return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});}catch(error){console.error('Login failed',error);return Response.json({error:'Kirish amalga oshmadi. Qayta urinib ko‘ring.'},{status:503});}
}
