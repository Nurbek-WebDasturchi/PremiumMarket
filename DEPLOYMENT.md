Deployment Qo'llanmasi
Bu fayl loyihani internetga chiqarishni oddiy qadamlarda tushuntiradi.

Platformalar:

Database, Auth, Storage: Supabase
Backend API: Render
Frontend website: Vercel

1. Supabase Tayyorlash
   https://supabase.com saytiga kiring.
   Yangi project yarating.
   Project ochilgandan keyin SQL Editor bo'limiga kiring.
   supabase/schema.sql faylidagi kodni copy qilib, SQL Editor'da run qiling.
   supabase/storage-policies.sql faylidagi kodni run qiling.
   supabase/seed.sql faylidagi kodni run qiling.
   Storage bo'limiga kirib, product-images bucket borligini tekshiring.
   Supabase Settings -> API bo'limidan quyidagilarni oling:

Project URL
anon public key
service_role key
Muhim:

anon public key frontend uchun.
service_role key backend uchun.
service_role key maxfiy. Uni hech qachon frontend .env fayliga yozmang. 2. GitHub'ga Yuklash
Deployment qilish uchun project GitHub repo'da bo'lishi kerak.

Oddiy tartib:

git init
git add .
git commit -m "Initial marketplace project"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
your-username va your-repo o'rniga o'zingizning GitHub ma'lumotlaringizni yozing.

3. Backend'ni Render'ga Deploy Qilish
   https://render.com saytiga kiring.
   New tugmasini bosing.
   Web Service tanlang.
   GitHub repo'ni ulang.
   Root directory sifatida quyidagini yozing:
   backend
   Render sozlamalarini shunday qiling:
   Build Command: npm install && npm run build
   Start Command: npm start
   Node Version: 20+
   Environment variables qo'shing:
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://your-vercel-app.vercel.app
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   Tushuntirish:

CLIENT_URL bu frontend Vercel linki.
Hali Vercel link bo'lmasa, vaqtincha http://localhost:5173 yozib turing.
Frontend deploy bo'lgandan keyin CLIENT_URL ni Vercel linkiga almashtirasiz.
Deploy Web Service tugmasini bosing.
Deploy tugagach, Render sizga backend URL beradi. Masalan:
https://premiummarket.onrender.com
Health check:

https://premiummarket.onrender.com/api/health
Agar shu link JSON qaytarsa, backend ishlayapti.

4. Frontend'ni Vercel'ga Deploy Qilish
   https://vercel.com saytiga kiring.
   Add New Project bosing.
   GitHub repo'ni import qiling.
   Root directory sifatida quyidagini tanlang:
   frontend
   Environment variables qo'shing:
   VITE_API_URL=https://premiummarket.onrender.com/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   Tushuntirish:

VITE_API_URL bu Render backend URL + /api. Bu project uchun: https://premiummarket.onrender.com/api.
VITE_SUPABASE_URL Supabase project URL.
VITE_SUPABASE_ANON_KEY Supabase anon public key.
Deploy tugmasini bosing.
Deploy tugagach, Vercel sizga frontend URL beradi. Masalan:
https://premium-marketplace.vercel.app 5. Render CORS'ni Yangilash
Vercel deploy tugagandan keyin:

Vercel frontend URL'ni copy qiling.
Render dashboard'ga kiring.
Backend service'ni oching.
Environment variables ichida CLIENT_URL ni Vercel URL'ga o'zgartiring:
CLIENT_URL=https://premium-marketplace.vercel.app
Backend'ni redeploy qiling.
Bu muhim, chunki backend faqat shu frontend URL'dan kelgan requestlarni qabul qiladi.

6. Admin User Yaratish
   Frontend saytda register qiling.
   Supabase SQL Editor'da quyidagini ishga tushiring:
   update public.profiles
   set role = 'admin'
   where email = 'your-email@example.com';
   Saytdan logout qiling.
   Qayta login qiling.
   Navbar'da Admin linki chiqadi.
7. Production Checklist
   Deployment tugadi deyishdan oldin bularni tekshiring:

Supabase project yaratildi
schema.sql ishga tushdi
storage-policies.sql ishga tushdi
seed.sql ishga tushdi
product-images bucket yaratildi
Render backend deploy bo'ldi
Render environment variables to'g'ri yozildi
Vercel frontend deploy bo'ldi
Vercel environment variables to'g'ri yozildi
Frontend VITE_API_URL Render backend URL'ga qarayapti
Backend CLIENT_URL Vercel frontend URL'ga qarayapti
Admin role berildi
Login/register ishlayapti
Product list chiqyapti
Checkout demo order yaratyapti 8. Ko'p Uchraydigan Muammolar
Frontend productlarni ko'rsatmayapti
Tekshiring:

VITE_API_URL to'g'rimi?
Backend Render'da ishlayaptimi?
Supabase SQL seed data run qilinganmi?
Login ishlamayapti
Tekshiring:

VITE_SUPABASE_URL to'g'rimi?
VITE_SUPABASE_ANON_KEY to'g'rimi?
Supabase Auth yoqilganmi?
Checkout ishlamayapti
Tekshiring:

User login qilganmi?
Cart bo'sh emasmi?
Backend SUPABASE_SERVICE_ROLE_KEY to'g'rimi?
CORS xatosi chiqyapti
Render'dagi CLIENT_URL Vercel link bilan bir xil bo'lishi kerak.

Masalan:

CLIENT_URL=https://premium-marketplace.vercel.app
Keyin backend'ni redeploy qiling.

9. Lokal Build Tekshirish
   Deploy qilishdan oldin lokal build qilib ko'ring:

npm run build
Windows PowerShell muammo qilsa:

npm.cmd run build
Agar build muvaffaqiyatli tugasa, loyiha deploy qilishga tayyor.

10. Yakuniy Tartib
    Eng qisqa deployment tartibi:

Supabase project yarating.
SQL fayllarni run qiling.
GitHub'ga push qiling.
Render'da backend deploy qiling.
Vercel'da frontend deploy qiling.
Render CLIENT_URL ni Vercel URL bilan yangilang.
Admin user role bering.
Saytni test qiling.
