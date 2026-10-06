import { seedContent } from './seed';
import type { Content, RecordItem, Settings } from './types';
import { getJSON, listKeys, setJSON } from './storage';
type SavedRecord={deleted:true}|{deleted:false;record:RecordItem};
const store='sino-school-content';
export async function readContent(includeDrafts=false):Promise<Content>{
 const keys=await listKeys(store,'records/');const entries=await Promise.all(keys.map(async key=>[key.slice(8),await getJSON<SavedRecord>(store,key)] as const));const overlay=new Map(entries),records:RecordItem[]=[];
 for(const item of seedContent.records){const value=overlay.get(item.id);overlay.delete(item.id);if(value?.deleted)continue;records.push(value&&!value.deleted?value.record:item);}
 for(const value of overlay.values())if(value&&!value.deleted)records.push(value.record);
 return {records:includeDrafts?records:records.filter(record=>record.published),settings:await getJSON<Settings>(store,'settings')||seedContent.settings};
}
export async function saveRecord(record:RecordItem){await setJSON(store,'records/'+record.id,{deleted:false,record});}
export async function deleteRecord(id:string){await setJSON(store,'records/'+id,{deleted:true});}
export async function saveSettings(settings:Settings){await setJSON(store,'settings',settings);}
