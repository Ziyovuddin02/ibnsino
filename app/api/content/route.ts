import { z } from 'zod';
import { isAdmin, sameOrigin } from '@/lib/admin';
import { readContent, saveRecord, deleteRecord, saveSettings } from '@/lib/store';
export const dynamic = 'force-dynamic';
const headers = {'Cache-Control':'no-store'};
const localized = z.object({uz:z.string().max(20000),ru:z.string().max(20000),en:z.string().max(20000)});
const record = z.object({id:z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),kind:z.enum(['news','staff','students','admission','gallery','certificates']),title:localized,body:localized,image:z.string().max(500).refine(s => !s || /^\/images\/[a-zA-Z0-9._-]+$/.test(s) || /^\/media\/[a-zA-Z0-9._-]+$/.test(s)),date:z.string().refine(s=> !s || /^\d{4}-\d{2}-\d{2}$/.test(s)),category:z.string().max(80),university:localized,year:z.string().max(20),published:z.boolean(),count:z.number().int().min(0).max(1000000).nullable().optional()});
const link = z.string().max(500).refine(s=> !s || /^https:\/\//.test(s));
const settings = z.object({address:localized,phone:z.string().max(80),email:z.union([z.literal(''),z.string().email()]),telegram:link,instagram:link,youtube:link});
export async function GET(request: Request) {
 try { const admin = new URL(request.url).searchParams.get('admin') === '1'; if (admin && !await isAdmin()) return Response.json({error:'Access denied'}, {status:403,headers}); return Response.json(await readContent(admin),{headers}); }
 catch(e) { console.error('Content read failed',e);return Response.json({error:'Ma’lumotlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.'},{status:503,headers}); }
}
export async function POST(request: Request) {
 if (!sameOrigin(request) || !await isAdmin()) return Response.json({error:'Access denied'},{status:403});
 try {
  if (Number(request.headers.get('content-length') || 0) > 200000) return Response.json({error:'Request too large'},{status:413});
  const data = z.object({action:z.enum(['settings','delete']).optional(),settings:z.unknown().optional(),id:z.unknown().optional(),record:z.unknown().optional()}).parse(await request.json());
  if(data.action === 'settings') { const parsed=settings.parse(data.settings);await saveSettings(parsed); }
  else if(data.action === 'delete') { await deleteRecord(z.string().regex(/^[a-zA-Z0-9-]{1,80}$/).parse(data.id)); }
  else { const item=record.parse(data.record); if(item.published && (Object.values(item.title).some(t=>!t.trim()) || (!['gallery','certificates'].includes(item.kind) && Object.values(item.body).some(t=>!t.trim())))) return Response.json({error:'Nashr qilish uchun uch tildagi sarlavha va matnni to‘ldiring.'},{status:400});if(item.published && item.kind==='gallery' && !item.image) return Response.json({error:'Rasm yuklang.'},{status:400}); if(item.published && item.kind==='students' && Object.values(item.university).some(t=>t.trim()) && Object.values(item.university).some(t=>!t.trim())) return Response.json({error:'Universitet nomini uch tilda to‘ldiring.'},{status:400}); await saveRecord(item); }
  return Response.json({ok:true},{headers});
 } catch(e) {if(e instanceof z.ZodError) return Response.json({error:'Maydonlarni tekshiring. Rasm va havolalar to‘g‘ri bo‘lishi kerak.'},{status:400});console.error('Content save failed',e);return Response.json({error:'Saqlanmadi. Qayta urinib ko‘ring.'},{status:503});}
}
