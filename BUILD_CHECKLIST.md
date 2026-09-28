# Build acceptance tracker

Source of truth: Hassana_Portfolio_Build_Prompt.md. The supplied HTML is a visual reference, not identity/content to copy.

- [x] Midnight Lilac homepage source: badge, four words, photo collage, separate galleries, floating nav, motion controls and responsive CSS
- [x] Typed content validation, relational revision schema, owner authorization, RLS and private-media access code
- [x] Owner CRUD editors, section builder with drag/move controls, CV manager and inbox
- [x] Independent drafts, authenticated homepage/record previews and atomic site publication
- [x] Central role visibility, matching database restrictions, direct-route 404s and filtered sitemap
- [x] Engineering/data project outlines, internal/external articles, video/embed support and database-first contact handler
- [x] Confirmed seed-only removal, no automatic reseeding and empty states
- [x] TypeScript checks and production build
- [x] PostgreSQL behavior/security tests and demo HTTP smoke tests
- [ ] Browser visual/interaction inspection at 320px, 390px, tablet and 1440px (browser tool reports no available browser)
- [ ] Connected Supabase/auth/storage/contact integration verification (external configuration)
- [x] Environment example, migration, setup/deployment instructions and owner guide

## Acceptance evidence

1. Combined demo renders both project sections; both listing endpoints return 200.
2. PostgreSQL tests publish single-role modes and confirm inactive-only records/profiles/media are absent; TypeScript tests guard template visibility too.
3. Tests re-enable a role and restore its eligible published records; a both-disabled site revision is rejected.
4. Tests save a changed draft without modifying public content and inspect the owner draft snapshot. HTTP checks verify unauthenticated preview returns 307 to login. Connected preview interaction remains unverified.
5. Editors implement all agreed record types, ordering, section insertion/hiding/moving and private media upload/replacement/deletion. Actual owner UI use needs browser and Supabase verification.
6. Tests clear marked starter records while preserving a manually created record; subsequent reads remain empty of removed seeds.
7. Demo article/project detail routes return 200; CV mode tests pass. Embed/video and download behavior still require connected browser checks.
8. PostgreSQL tests switch to anonymous/non-owner roles and deny drafts, enquiries, media tables and mutations.
9. Unconfigured contact POST returns 503, never false success. Persistence-first code and optional notification handling are implemented; real persistence and provider failure need connected verification.
10. Keyboard controls, paused/reduced motion and mobile layouts are implemented but not visually verified in a browser.

The current local preview runs at http://localhost:3100; owner demo at /admin/demo. No deployment, remote database mutation, account creation or Git push has been performed.

Workspace at start: all previous application files already deleted; only the build prompt remained. Do not restore or discard unrelated changes. Existing Git history is available as a read-only content source.

Reference: supplied HTML inspected (embedded assets excluded from text inspection). Live design and Google Doc links were inaccessible to the web tool. No reference-owner content will be reused.
