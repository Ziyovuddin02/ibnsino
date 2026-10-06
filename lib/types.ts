export type Lang = 'uz' | 'ru' | 'en';
export type Localized = Record<Lang, string>;
export type Kind = 'news' | 'staff' | 'students' | 'admission' | 'gallery' | 'certificates';
export interface RecordItem { id: string; kind: Kind; title: Localized; body: Localized; image: string; date: string; category: string; university: Localized; year: string; published: boolean; count?: number | null; }
export interface Settings { address: Localized; phone: string; email: string; telegram: string; instagram: string; youtube: string; }
export interface Content { records: RecordItem[]; settings: Settings; }
export const languages: Lang[] = ['uz','ru','en'];
export const emptyText = (): Localized => ({uz:'',ru:'',en:''});
