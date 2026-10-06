import { getStore } from '@netlify/blobs';
import { mkdir, readFile, readdir, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
const local=()=>process.env.STORAGE_BACKEND==='local'||process.env.NODE_ENV!=='production';
const directory=(name:string)=>join(process.env.LOCAL_DATA_DIR||join(process.cwd(),'.local-data'),name);
function remote(name:string){const siteID=process.env.NETLIFY_SITE_ID,token=process.env.NETLIFY_BLOBS_TOKEN;return getStore({name,consistency:'strong',...(siteID&&token?{siteID,token}:{})});}
function file(name:string,key:string,suffix:string){return join(directory(name),encodeURIComponent(key)+suffix);}
async function localRead(path:string){try{return await readFile(path);}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error;}}
export async function getJSON<T>(name:string,key:string):Promise<T|null>{if(!local())return await remote(name).get(key,{type:'json'}) as T|null;const bytes=await localRead(file(name,key,'.json'));return bytes?JSON.parse(bytes.toString()):null;}
export async function setJSON(name:string,key:string,value:unknown){if(!local()){await remote(name).setJSON(key,value);return;}await mkdir(directory(name),{recursive:true});const path=file(name,key,'.json'),temporary=path+'.'+randomUUID();await writeFile(temporary,JSON.stringify(value));await rename(temporary,path);}
export async function listKeys(name:string,prefix:string){if(!local())return (await remote(name).list({prefix})).blobs.map(blob=>blob.key);try{return (await readdir(directory(name))).filter(path=>path.endsWith('.json')&&!path.endsWith('.meta.json')).map(path=>decodeURIComponent(path.slice(0,-5))).filter(key=>key.startsWith(prefix));}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return [];throw error;}}
export async function saveFile(key:string,buffer:ArrayBuffer,contentType:string){if(!local()){await remote('sino-school-media').set(key,buffer,{metadata:{contentType}});return;}await mkdir(directory('sino-school-media'),{recursive:true});await writeFile(file('sino-school-media',key,'.bin'),Buffer.from(buffer));await writeFile(file('sino-school-media',key,'.meta.json'),JSON.stringify({contentType}));}
export async function getFile(key:string):Promise<{data:ArrayBuffer;contentType:string}|null>{if(!local()){const result=await remote('sino-school-media').getWithMetadata(key,{type:'arrayBuffer'});return result?{data:result.data,contentType:String(result.metadata.contentType||'application/octet-stream')}:null;}const bytes=await localRead(file('sino-school-media',key,'.bin'));if(!bytes)return null;const meta=await localRead(file('sino-school-media',key,'.meta.json'));return {data:Uint8Array.from(bytes).buffer,contentType:meta?JSON.parse(meta.toString()).contentType:'application/octet-stream'};}
// Atomic slots limit all server instances to 10 login attempts in each 5-minute window.
export async function claimLoginAttempt(now=Date.now()){
 const window=Math.floor(now/300000);if(local())await mkdir(directory('sino-school-auth'),{recursive:true});
 for(let slot=0;slot<10;slot++){const key=`login-${window}-${slot}`;if(!local()){if((await remote('sino-school-auth').set(key,'1',{onlyIfNew:true})).modified)return true;}else{try{await writeFile(file('sino-school-auth',key,'.slot'),'1',{flag:'wx'});return true;}catch(error){if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;}}}
 return false;
}
