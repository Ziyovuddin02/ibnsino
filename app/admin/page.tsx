import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function AdminPage(){if(!await isAdmin())redirect('/admin/login');return <Admin userName={process.env.ADMIN_NAME||'Bekmuratov Ziyovuddin'}/>;}
