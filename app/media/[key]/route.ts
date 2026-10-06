import { getFile } from '@/lib/storage';
export async function GET(_request: Request, context: {params:Promise<{key:string}>}) {
 const {key}=await context.params;if(!/^[a-zA-Z0-9.-]{1,100}$/.test(key))return new Response('Not found',{status:404});
 try {const file=await getFile(key);if(!file)return new Response('Not found',{status:404});return new Response(file.data,{headers:{'Content-Type':file.contentType || 'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});}catch(e){console.error(e);return new Response('Unavailable',{status:503});}
}
