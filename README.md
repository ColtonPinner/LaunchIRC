# Indian River Launchpad

Launch IRC provides business launch guidance, local resources, events, and personalized checklists for Indian River County entrepreneurs.

## Local Development

1. Install dependencies with `yarn install`.
2. Create a Supabase project.
3. Run the SQL files in `supabase/migrations` in filename order using the project's SQL editor.
4. Copy `.env.example` to `.env.local` and add the project's URL and publishable key.
5. Start the development server with `yarn start`.
6. Build for production with `yarn build`.

Authentication uses Supabase Auth. Application records are stored in Supabase Postgres with row-level security enabled and scoped to their owners.

### Auth Email Limits

Supabase's built-in mail service is intended for initial testing and can return `email rate limit exceeded`. For production, configure custom SMTP under the project's Authentication settings. During local-only testing, email confirmation can instead be disabled; do not disable it for production accounts.

## Staff Inquiry Portal

Run all migrations, then assign trusted staff roles from the Supabase SQL editor using an account email:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"staff"}'::jsonb
where email = 'staff@example.com';
```

The staff member must log out and back in to refresh their token, then open `/staff/inquiries`. Use `admin` instead of `staff` for an administrator. Never store staff roles in user metadata.

## Customer And Provider Portals

- `/customer/login` and `/customer/register` are the customer authentication entry points.
- `/professional/login` is shared by trusted staff and providers; `/professional/register` creates provider accounts.
- `/portal` lets signed-in customers track Launch IRC consultation requests and messages sent to directory providers.
- `/provider` lets signed-in providers monitor listing approval and manage incoming directory leads.
- `/directory/join` requires an account so each submitted listing is linked to its provider.
- Directory visitors can contact an approved provider from the provider's public listing. Signed-in customers can attach a saved survey; all questionnaire answers are then visible only to that listing's provider and trusted staff. The request also appears in the customer's portal.
