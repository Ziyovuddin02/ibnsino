import { saveFile } from '@/lib/storage';
import { isAdmin, sameOrigin } from '@/lib/admin';
export async function POST(request: Request) {
 if(!sameOrigin(request) || !await isAdmin()) return Response.json({error:'Access denied'},{status:403});
 try {
  if(Number(request.headers.get('content-length') || 0)>5*1024*1024) return Response.json({error:'Rasm 4 MB dan oshmasin.'},{status:413});
  const form=await request.formData(),file=form.get('file');
  if(!(file instanceof File) || file.size===0 || file.size>4*1024*1024) return Response.json({error:'Rasm tanlang (4 MB gacha).'},{status:400});
  const buffer=await file.arrayBuffer(),b=new Uint8Array(buffer);
  let type='',ext='';
  if(b[0]===0xff&&b[1]===0xd8&&b[2]===0xff){type='image/jpeg';ext='jpg';}
  else if(b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71){type='image/png';ext='png';}
  else if(String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP'){type='image/webp';ext='webp';}
  else if(String.fromCharCode(...b.slice(0,6)).match(/^GIF8[79]a$/)){type='image/gif';ext='gif';}
  else return Response.json({error:'JPG, PNG, WEBP yoki GIF rasm yuklang.'},{status:400});
  const key=crypto.randomUUID()+'.'+ext;await saveFile(key,buffer,type);
  return Response.json({url:'/media/'+key});
 }catch(e){console.error('Upload failed',e);return Response.json({error:'Rasm yuklanmadi. Qayta urinib ko‘ring.'},{status:503});}
}
