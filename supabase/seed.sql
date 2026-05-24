insert into public.categories (name, slug, description, image_url) values
('Maishiy texnika', 'maishiy-texnika', 'Uy uchun premium texnika va qulay yechimlar.', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80'),
('Elektrotexnika', 'elektrotexnika', 'Smartfon, noutbuk va zamonaviy elektronika.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'),
('Aksessuarlar', 'aksessuarlar', 'Kundalik hayot uchun chiroyli va foydali aksessuarlar.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80'),
('Kiyim-kechak', 'kiyim-kechak', 'Zamonaviy kiyimlar, poyabzal va uslubiy tanlovlar.', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80')
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, description, brand, price, old_price, stock, images, is_featured, specs)
select c.id, p.name, p.slug, p.description, p.brand, p.price, p.old_price, p.stock, p.images, p.is_featured, p.specs
from (
  values
  ('maishiy-texnika', 'Samsung NeoWash 9kg', 'samsung-neowash-9kg', 'AI yuvish rejimlari, kam shovqin va energiya tejovchi motor.', 'Samsung', 599.00, 699.00, 18, array['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80'], true, '{"capacity":"9 kg","energy":"A+++","warranty":"3 yil"}'::jsonb),
  ('maishiy-texnika', 'Artel FrostMax Sovutkich', 'artel-frostmax-sovutkich', 'Katta sigim, no-frost tizimi va premium oynali dizayn.', 'Artel', 749.00, 829.00, 11, array['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80'], true, '{"volume":"420 L","type":"No Frost","color":"Graphite"}'::jsonb),
  ('elektrotexnika', 'iPhone 15 Pro 256GB', 'iphone-15-pro-256gb', 'Titan korpus, kuchli kamera va yuqori unumdorlik.', 'Apple', 1199.00, 1299.00, 25, array['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80'], true, '{"storage":"256 GB","display":"6.1 inch","chip":"A17 Pro"}'::jsonb),
  ('elektrotexnika', 'Lenovo Yoga Slim 7', 'lenovo-yoga-slim-7', 'Ish, oqish va kreativ vazifalar uchun yengil ultrabuk.', 'Lenovo', 899.00, 999.00, 14, array['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80'], false, '{"ram":"16 GB","ssd":"512 GB","display":"14 inch"}'::jsonb),
  ('aksessuarlar', 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Shovqinni faol pasaytirish va studiyadek ovoz.', 'Sony', 349.00, 399.00, 33, array['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'], true, '{"battery":"30 soat","noiseCanceling":"Yes","connection":"Bluetooth"}'::jsonb),
  ('aksessuarlar', 'Nomad Leather Wallet', 'nomad-leather-wallet', 'Minimalistik charm hamyon, kundalik premium aksessuar.', 'Nomad', 59.00, 79.00, 48, array['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80'], false, '{"material":"Leather","slots":"8","color":"Black"}'::jsonb),
  ('kiyim-kechak', 'Nike Tech Fleece Hoodie', 'nike-tech-fleece-hoodie', 'Yumshoq, issiq va sport uslubidagi kundalik hoodie.', 'Nike', 129.00, 159.00, 40, array['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80'], true, '{"size":"S-XL","material":"Cotton blend","fit":"Regular"}'::jsonb),
  ('kiyim-kechak', 'Adidas Ultraboost Light', 'adidas-ultraboost-light', 'Yugurish va shahar hayoti uchun qulay krossovka.', 'Adidas', 189.00, 220.00, 32, array['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'], false, '{"size":"39-45","upper":"Primeknit","sole":"Boost"}'::jsonb)
) as p(category_slug, name, slug, description, brand, price, old_price, stock, images, is_featured, specs)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;
