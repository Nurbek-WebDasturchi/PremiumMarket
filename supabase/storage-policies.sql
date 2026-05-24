insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public product image read"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Authenticated product image uploads"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

create policy "Authenticated product image updates"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images');

create policy "Authenticated product image deletes"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
