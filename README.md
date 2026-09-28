# Hassana's Midnight Lilac portfolio

Next.js App Router, TypeScript, Tailwind CSS, Supabase Postgres/Auth/Storage. The supplied build prompt remains the product specification. The attached HTML informed the visual composition; its owner, assets and claims were not copied.

## Run locally

Requires Node.js 20.9+ (built here with Node 24).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. With no Supabase environment variables, the site is explicitly labelled **demo mode**. `/admin/demo` demonstrates the editors with in-memory state; reloading resets it. It does not emulate authentication, persistent storage or contact delivery. Demo settings and content are in `lib/demo.ts`.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Connect Supabase

1. Create a Supabase project. Run `supabase/migrations/001_portfolio.sql` in its SQL editor, once, in a new project. The migration creates relational content entries and immutable revision records, site revisions, owner authorization, media metadata, enquiries, rate limits, RPCs and the private `portfolio` storage bucket. It inserts no portfolio content.
2. In Auth settings, disable public signups. Create your owner account using the Supabase dashboard; confirm its email. Copy its **user UUID**, not its email, and run:

   ```sql
   insert into public.owners(user_id) values ('YOUR-AUTH-USER-UUID');
   ```

   Signing in alone never grants administration. Only the allow-listed UUID can administer the site, including via direct database requests.
3. Copy `.env.example` to `.env.local`. Set the public project URL and anon key. Set the server-only service-role key for media streaming and contact persistence. Generate a long random `CONTACT_RATE_LIMIT_SECRET`. Never prefix either secret with `NEXT_PUBLIC_` or commit `.env.local`.
4. Set `NEXT_PUBLIC_SITE_URL` to the canonical site origin. Add the site's URL to Supabase Auth's allowed site/redirect URLs. Restart Next.js after changing environment variables.
5. Visit `/admin/login` and sign in. Start in **Settings** and save the draft. Review all three **Site modes** profiles, upload your own portraits in **Media**, and select them in Settings. Initial configured settings deliberately have no demo portrait selected.
6. Use **Preview saved drafts** after saving. Select desktop/mobile and each role mode. Publish site settings when ready. Until the first publication, the public site displays its setup/error state; it does not silently substitute sample data for an empty database.
7. Add your own records, or explicitly add optional sample drafts from Overview when the library is empty. Samples are labelled, removable and never automatically seeded. Publish selected records individually.

## Contact and email

The form writes an enquiry to Postgres before returning success. The inbox is owner-only. Honeypot, field/body limits, same-origin validation and an atomic database rate limit protect submissions. The service-role key is never sent to the browser.

Optional Resend notifications require `RESEND_API_KEY`, a verified `CONTACT_NOTIFICATION_FROM`, and `CONTACT_NOTIFICATION_TO`. A notification failure is recorded as `failed` but does not undo a saved enquiry or tell the visitor their saved message failed. With no email provider, messages can still be persisted and the inbox records `unconfigured`. Without database/service-key/rate-secret configuration, submission returns 503 and never claims delivery.

Rate limiting uses Vercel's trusted forwarding header, then `x-real-ip`, with a shared fallback for local development. If deploying behind another proxy, configure it to overwrite trusted client-IP headers; do not trust arbitrary visitor-supplied forwarding headers. The default limit is five submissions per hour per hashed IP. Rate-limit rows expire after one day. No raw IP is stored.

## Storage and publication

- All uploads stay in the **private** `portfolio` bucket. Supported types: JPEG, PNG, WebP, PDF, MP4, maximum 25 MB. The server validates both declared MIME type and file signature. SVG and executable uploads are rejected.
- Uploads use owner-authorized, path-specific signed upload tokens to transfer directly to Supabase. The server verifies the uploaded bytes before registering the media item, avoiding host request-body limits for larger files. Downloads are streamed and support byte ranges for video seeking.
- Public `/api/media/[id]` requests are served only when the current published, role-visible snapshot references the asset. Owner-authenticated requests can preview private assets. Responses are private/no-store and do not expose permanent signed storage URLs.
- Unpublishing or disabling a role prevents new anonymous requests for assets exclusively referenced by that content. Previously downloaded files cannot be recalled.
- Replace an asset by uploading a new file and changing its draft reference. Published content continues to use its previous file until publication. Old uploads remain private in Media; there is no automatic destructive cleanup.
- The confirmed **Delete unused file** action checks current draft and published references first. It refuses to delete files still in use. Historical superseded revisions are not a supported restore interface and may refer to an old file after explicit deletion.
- Project videos support uploaded MP4 media, an accessible title and cover poster, plus external HTTPS video links. Add a descriptive transcript in a text block when the video contains spoken or essential visual information.

## Content and security design

Content entries have independent draft and published revision IDs. Saving never overwrites the published revision. A site publication atomically swaps the settings revision, including role flags, profiles and section layout. Public reads use one `public_snapshot()` SQL statement, so settings and eligible content cannot be mixed across database snapshots. Public pages are dynamically rendered; publication also invalidates the Next.js layout cache.

The central TypeScript visibility resolver is mirrored by database `scope_visible` / `record_visible` functions, with regression tests covering both. Inactive-only entries are absent from anonymous RPC responses, listings, detail routes and sitemaps. Inactive role profiles and sections are stripped from the public settings payload. CV mode eligibility is explicitly configured independently of role tagging.

Settings are validated by a strict typed shape before writes; content records use a shared validated type with ordered blocks, rather than storing the entire application in one unvalidated document. The database adds role, slug, kind and owner constraints. Rich text is safe Markdown without executable HTML or inline image injection. Managed image blocks and HTTPS links are explicit. Dashboard embeds are restricted to Power BI and public Tableau.

The revision schema is append-only through application actions; an authorized owner retains SQL-level management access via RLS. This is a single-owner CMS, not a collaborative editing/merge system. Concurrent editors should refresh before saving to avoid replacing each other's newer draft pointers.

## Deploy

Deploy the repository to a Node-compatible Next.js host such as Vercel. Set all required environment variables on that host, apply the migration, register the owner and publish the site. Build command: `npm run build`; start command for self-hosting: `npm start`.

No external deployment, Supabase project or email account was created by this build. No secrets were supplied. Connected authentication, real Storage transfers and actual email delivery still need end-to-end verification in your project.

## Verification

`npm test` runs the TypeScript role/validation checks and the real migration inside an isolated PGlite PostgreSQL database. The test harness creates mock Supabase auth/storage schemas and switches between owner, non-owner, anonymous and service roles. It verifies draft isolation, coherent site modes, hidden-role restoration, rejection of both roles off, duplicate published slugs, RLS, media revocation, seed-only clearing and rate limiting. This is database logic verification, not a claim of live Supabase integration.

Browser visual inspection could not run because the provided browser-control tool reported no available browser. The responsive CSS includes 320px/mobile layouts, keyboard controls, focus styles and reduced-motion alternatives; these still need browser review at 320/390/768/1440px, including pinned galleries with at least three items.

See `OWNER_GUIDE.md` and `BUILD_CHECKLIST.md` for workflows and remaining acceptance checks.

## Content provenance

- The Git history in this workspace contains the existing engineering portfolio. Its `public/bitHassy.jpg` avatar and `public/hassy.JPEG` photo were recovered into `/public/demo/` for the explicitly labelled demonstration. The original deleted working files were not restored.
- The existing engineering project list used remote Firebase data. Its project records were not imported or invented.
- The supplied data-analysis GitHub URL could not be fetched by the web tool. No data-analysis projects, credentials, quotes or outcomes are claimed to have been imported.
- The live design and Google Docs reference links were inaccessible. The attached HTML source was inspected instead; none of its original owner's assets or personal details are included.
- Demo project SVGs are original illustrative layouts with sample labels and fictional data, not completed client projects.

Official setup references: [Supabase server-side Next.js auth](https://supabase.com/docs/guides/auth/server-side/nextjs), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control), [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email).
