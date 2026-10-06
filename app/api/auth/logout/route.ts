import { cookies } from 'next/headers';
import { sameOrigin } from '@/lib/admin';
import { SESSION_COOKIE } from '@/lib/session';
export async function POST(request:Request){if(!sameOrigin(request))return Response.json({error:'Access denied'},{status:403});(await cookies()).set(SESSION_COOKIE,'',{httpOnly:true,sameSite:'strict',secure:new URL(request.headers.get('origin')!).protocol==='https:',path:'/',maxAge:0});return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});}
