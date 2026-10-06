# Abu Ali ibn Sino maktabi — Chinoz filiali

Netlify uchun tayyorlangan to‘liq loyiha. Next.js, React va Netlify Blobs ishlatiladi.

## Ichida nimalar bor?

- Saytning barcha rasmlari, yangi logotip, uch til va kunduzgi/tungi mavzu.
- Suzuvchi kimyo elementlari, suratlar animatsiyasi va markazda ochiladigan batafsil oyna.
- Galereyada tugmalar, klaviatura va telefonda surish orqali o‘tish.
- Yangiliklar, xodimlar, bitiruvchilar, qabul, galereya va milliy sertifikatlarni boshqaruvchi admin panel.
- Serverda tekshiriladigan admin paroli va 8 soatlik himoyalangan sessiya.
- Ma’lumotlar hamda yuklangan rasmlar uchun Netlify Blobs saqlashi.
- Mavjud barcha matnlar va rasmlar. Ko‘chirish paytidagi admin ma’lumotlari ham kiritilgan: ona tili 42, tarix 32. Ingliz tili va matematika uchun sonlar hali kiritilmagan.

## Netlifyga joylash — GitHub orqali

1. ZIP faylni oching. `sino-chinoz-netlify` papkasi ichidagi fayllarni yangi GitHub repositoryga yuklang. `package.json`, `netlify.toml`, `app`, `lib` va `public` repositoryning asosiy papkasida bo‘lsin.
2. Netlify hisobingizga kiring va Git repositorydan yangi loyiha import qiling. GitHub repositoryni tanlang.
3. Build command: `npm run build`. Publish directory: `.next`. Node.js: `22`. `netlify.toml` bu sozlamalarni avtomatik beradi. Next.js adapterini Netlify avtomatik ishlatadi.
4. Loyiha sozlamalaridagi Environment variables bo‘limida quyidagilarni kiriting. Build va Functions uchun mavjud bo‘lsin:
   - `ADMIN_PASSWORD`: o‘zingiz tanlagan kamida 12 belgili kuchli parol.
   - `SESSION_SECRET`: kamida 32 belgili tasodifiy maxfiy satr. Yaratish buyrug‘i quyida.
   - `ADMIN_NAME`: `Bekmuratov Ziyovuddin` (ixtiyoriy).
5. Deploy qiling. Sozlamalar keyin kiritilsa, qayta deploy qiling.
6. Sayt manziliga `/admin` qo‘shing va ADMIN_PASSWORD bilan kiring. ChatGPT hisobiga kirish talab qilinmaydi.

SESSION_SECRET yaratish:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Parol va SESSION_SECRET ni GitHubga yoki ommaviy fayllarga qo‘ymang. `.env.example` bo‘sh namuna sifatida berilgan. Ularga `NEXT_PUBLIC_` prefiksi qo‘yilmaydi.

**Muhim:** bu admin paneli va server funksiyalari bor loyiha. ZIP faylni Netlify Drop oynasiga tashlash yetarli emas. Git orqali import qilib build qilish yoki Netlify CLI orqali deploy qilish kerak.

## Kompyuterda ishga tushirish

Node.js 22.13 yoki yangiroq versiya o‘rnating. Loyiha papkasida:

```bash
npm ci
```

`.env.example` faylidan `.env.local` nusxasi yarating va ADMIN_PASSWORD hamda SESSION_SECRET ni yozing. So‘ng:

```bash
npm run dev
```

Sayt: `http://localhost:3000`. Admin: `http://localhost:3000/admin`.

Development rejimida ma’lumotlar `.local-data` papkasiga yoziladi. Ular kompyuterni qayta ishga tushirganda saqlanadi, lekin Netlifyga avtomatik ko‘chmaydi. ZIPda saytning ko‘chirish paytidagi ma’lumotlari allaqachon `lib/seed.ts` ichida bor.

## Netlify CLI orqali

Git orqali joylash tavsiya etiladi. CLI ishlatmoqchi bo‘lsangiz, Netlify hisobingizga kirib loyiha bilan bog‘lang, parol va maxfiy satrni o‘sha loyiha sozlamalarida kiriting:

```bash
npx netlify-cli login
npx netlify-cli init
npx netlify-cli deploy --build --prod
```

## Saqlash qanday ishlaydi?

Productionda Netlify Blobs ishlatiladi:

- `sino-school-content`: admin yozuvlari va aloqa sozlamalari.
- `sino-school-media`: yuklangan rasmlar.
- `sino-school-auth`: kirish urinishlari uchun atomik cheklov.

Netlify server muhiti ulanishni avtomatik ta’minlaydi. Saqlash saytga bog‘liq bo‘lib, o‘sha loyiha qayta deploy qilinganda saqlanadi. Boshqa Netlify loyihasi ochilsa, uning saqlashi alohida bo‘ladi. Blobs uchun strong consistency ishlatiladi.

Netlifyda `STORAGE_BACKEND=local` belgilamang. Bu faqat mahalliy production tekshiruvi uchun. Server diskidagi fayllar Netlifyda doimiy saqlash o‘rnini bosa olmaydi.

Agar `npm start` orqali Netlifydan tashqarida production server ochsangiz, NETLIFY_SITE_ID va NETLIFY_BLOBS_TOKEN orqali Blobs ulanishini berishingiz yoki faqat mahalliy sinov uchun STORAGE_BACKEND=local belgilashingiz kerak. Token serverda maxfiy saqlanadi.

## Admin paneldan ishlash

Fanlar va sonlar: **Milliy sertifikatlar** bo‘limida tahrirlang. Son bo‘sh qolsa “Ma’lumot kutilmoqda” chiqadi; 0 kiritsangiz 0 ko‘rinadi. Yangi fan qo‘shganda uch tildagi nomlarni yozing va nashr belgisini yoqing.

Qabul sanalari va bo‘sh o‘rinlarni keyin **Qabul** bo‘limida kiriting. Yangiliklar, xodimlar, galereya va aloqa havolalari ham admin paneldan boshqariladi.

Rasm yuklash chegarasi Netlify so‘rov limitiga moslab **4 MB** qilingan. JPG, PNG, WEBP va GIF qabul qilinadi. SVG yuklashga ruxsat berilmaydi.

Kirish urinishlari butun admin panel uchun 5 daqiqalik oraliqda 10 martagacha cheklangan. Parol yoki SESSION_SECRET almashtirilsa, eski sessiyalar yaroqsiz bo‘ladi.

## Tekshiruv

```bash
npm test
npm run typecheck
npm run build
```

Tayyorlash vaqtida production build, sessiya xavfsizligi, kirish va chiqish, CSRF, tahrirlash/qo‘shish/o‘chirish, qoralamalar, rasm yuklash va server qayta ishga tushganda saqlash tekshirildi. Netlify hisobingizga real deploy ushbu ZIPni tayyorlash vaqtida amalga oshirilmagan.

## Rasmiy qo‘llanmalar

- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/

Bu nusxa alohida Netlify loyihasi uchun. Hozirgi ChatGPT Sites manzilingizdagi saytga ushbu ko‘chirish o‘zgarishlari qo‘llanmagan. Netlifyga o‘tgach, ikki saytning keyingi admin o‘zgarishlari mustaqil bo‘ladi.
