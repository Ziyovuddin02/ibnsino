import School from './school';
import { readContent } from '@/lib/store';
import { seedContent } from '@/lib/seed';
export const dynamic='force-dynamic';
export default async function Home(){try{return <School initial={await readContent()}/>;}catch(e){console.error('Initial content unavailable',e);return <School initial={seedContent} unavailable/>;}}
