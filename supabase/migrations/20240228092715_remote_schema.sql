alter table "public"."profiles" add column "plate_info" jsonb not null;

create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to service_role
using (true);


create policy "access_all_own_profile"
on "public"."profiles"
as permissive
for all
to authenticated
using ((user_id = auth.uid()));



