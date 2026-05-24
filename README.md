# Premium Marketplace

Bu loyiha Amazon, Uzum Market va MediaPark uslubidagi to'liq fullstack e-commerce marketplace platformasi.

Ishlatilgan texnologiyalar:

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand
- Backend: Node.js, Express, TypeScript
- Database/Auth/Storage: Supabase PostgreSQL, Supabase Auth, Supabase Storage
- Payment: demo checkout, ya'ni soxta to'lov tizimi
- Deployment: frontend uchun Vercel, backend uchun Render, database uchun Supabase

## Nimalar Bor

- Zamonaviy responsive shopping UI
- Dark mode va light mode
- Product search, filter, sort va pagination
- Product details, rating va review
- Cart, wishlist, checkout, order history
- Supabase Auth orqali login/register
- Himoyalangan user va admin route'lar
- Product, order, user va analytics uchun admin dashboard
- Supabase Storage orqali product image upload
- Error handling va JWT tekshiruvli REST API
- SQL schema, seed data va deployment qo'llanmalari

## Folder Tuzilishi

```text
premium-marketplace/
  backend/
    src/
      config/
      middleware/
      routes/
      services/
      types/
      utils/
      server.ts
    package.json
    tsconfig.json
    .env.example
  frontend/
    src/
      animations/
      components/
      hooks/
      layouts/
      pages/
      services/
      store/
      types/
      utils/
      App.tsx
      main.tsx
    package.json
    tsconfig.json
    vite.config.ts
    tailwind.config.ts
    .env.example
  supabase/
    schema.sql
    seed.sql
    storage-policies.sql
  DEPLOYMENT.md
  README.md
```

## Boshlang'ich O'rnatish

### 1. Node.js O'rnating

Node.js 20 yoki undan yangi versiyasini o'rnating:

https://nodejs.org

O'rnatilgandan keyin terminalda tekshiring:

```bash
node -v
npm -v
```

### 2. Supabase Project Yarating

1. https://supabase.com saytiga kiring.
2. Yangi project yarating.
3. SQL Editor bo'limini oching.
4. `supabase/schema.sql` faylidagi SQL kodni ishga tushiring.
5. `supabase/storage-policies.sql` faylidagi SQL kodni ishga tushiring.
6. `supabase/seed.sql` faylidagi SQL kodni ishga tushiring.

### 3. Environment Fayllarini Yarating

Quyidagi fayllardan nusxa oling:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Keyin `.env` fayllar ichiga Supabase project qiymatlaringizni yozing.

Muhim:

- Backend uchun `service_role` key kerak, chunki backend admin amallarini bajaradi.
- Frontend uchun faqat `anon public` key ishlatiladi.
- `service_role` key'ni frontendga yozmang.

### 4. Dependencies O'rnating

```bash
npm run install:all
```

Windows PowerShell `npm.ps1` xatosi bersa, quyidagisini ishlating:

```bash
npm.cmd run install:all
```

### 5. Loyihani Lokal Ishga Tushiring

```bash
npm run dev
```

Windows PowerShell muammo qilsa:

```bash
npm.cmd run dev
```

Ochish kerak bo'lgan linklar:

- Frontend: http://localhost:5173
- Backend API health check: http://localhost:4000/api/health

## Supabase Qiymatlarini Qayerdan Olasiz

Supabase dashboard ichida:

- Project URL: `Settings -> API -> Project URL`
- Anon key: `Settings -> API -> anon public`
- Service role key: `Settings -> API -> service_role`

Backend `.env`:

```text
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

Frontend `.env`:

```text
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Demo Payment Qanday Ishlaydi

Checkout sahifasida real pul yechilmaydi. Bu demo payment:

1. Cart ichidagi productlarni oladi.
2. Order yaratadi.
3. Order itemlarni database'ga yozadi.
4. Cart'ni tozalaydi.

Bu test va portfolio uchun xavfsiz.

## Admin Qilish

Avval saytda register qiling. Keyin Supabase SQL Editor'da shu kodni ishga tushiring:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

`your-email@example.com` o'rniga o'zingiz register qilgan emailni yozing.

Keyin saytdan logout qilib, qayta login qiling. Navbar'da `Admin` linki chiqadi.

## Asosiy Buyruqlar

```bash
npm run dev
npm run build
npm run lint
npm --prefix backend run dev
npm --prefix frontend run dev
```

Windows uchun:

```bash
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
npm.cmd --prefix backend run dev
npm.cmd --prefix frontend run dev
```

## Deployment

Deployment qilish uchun [DEPLOYMENT.md](DEPLOYMENT.md) faylini o'qing. U yerda Supabase, Render va Vercel bo'yicha qadamma-qadam yo'riqnoma bor.

## Oddiy Tushuntirish

- React website qismini yaratadi.
- Express backend API qismini yaratadi.
- Supabase userlar, productlar, orderlar, reviewlar, cart, wishlist va rasmlarni saqlaydi.
- Frontend backend API bilan gaplashadi.
- Supabase Auth register, login va tokenlarni boshqaradi.
- Render backend'ni internetga chiqaradi.
- Vercel frontend'ni internetga chiqaradi.

## Ishga Tushirish Tartibi Qisqacha

1. Node.js o'rnating.
2. Supabase project yarating.
3. SQL fayllarni Supabase SQL Editor'da ishga tushiring.
4. `.env` fayllarni yarating.
5. `npm run install:all` qiling.
6. `npm run dev` qiling.
7. Browser'da `http://localhost:5173` ni oching.
