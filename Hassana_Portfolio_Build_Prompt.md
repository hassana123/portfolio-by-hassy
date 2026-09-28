# Hassana’s combined portfolio — complete build prompt

## 1. Objective

Build a polished, responsive, animated portfolio for **Hassana Abdullahi**, giving **Front End Engineering and Data Analysis equal emphasis** when both roles are enabled. Use Next.js with Supabase and a fully functional private admin dashboard. This must be a working application with persistent content management, not a static mockup or a self-contained HTML file.

The public experience should feel creative, welcoming, elegant and playful, with strong typography, generous spacing and carefully choreographed motion. Keep written homepage content concise and let project visuals lead.

Design reference: https://bloomfloral.tiiny.co/ , https://docs.google.com/document/d/1Tr9WYjoDP3lK-4X-IKWp6kKp37NKhi91UHTkSleVRkk/mobilebasic

Possible sources for starter content:
- Engineering: https://portfolio-by-hassy.vercel.app/, https://github.com/hassana123/portfolio-by-hassy.git
- Data Analysis: https://personal-portfolio-da.vercel.app/, https://github.com/hassanaabdullahi/personal-Portfolio.git

Use the reference for its composition and interactions, especially the hanging ID card, oversized surrounding words, photo collages, floating pill navigation, animated typography and horizontal project galleries. Replace the original owner’s identity and assets completely. If the reference is inaccessible, follow the detailed requirements below and state that it could not be inspected; do not pretend to have viewed it.

## 2. Stack and implementation

- Next.js App Router, TypeScript and Tailwind CSS.
- Supabase Postgres for content, Supabase Auth for the owner account, and Supabase Storage for media and documents.
- Use server-rendered public content where appropriate and client components for interactive features. Dynamic means database-managed content with reliable publication updates; it does not require every page to fetch in the browser.
- Choose a coherent React-compatible animation approach, such as Motion, adding another library only when necessary for a specific effect.
- Use reusable components, typed data structures, validated server-side mutations, loading/error/empty states and maintainable code.
- Provide database migrations, security policies, an optional seed script, environment-variable examples and setup/deployment instructions. Never put secrets in the repository or browser bundle.
- If external configuration is unavailable, provide a clearly identified demo mode and precise setup steps. Do not claim persistence, email delivery or authentication works until connected and verified.

## 3. Midnight Lilac visual system

| Purpose | Colour | Hex |
|---|---|---|
| Hero, footer and dark text on light sections | Midnight indigo | #17152C |
| Dark cards and raised dark surfaces | Plum charcoal | #24213D |
| Main accent | Dreamy lavender | #B9A7F7 |
| Main light background | Warm ivory | #FAF8F4 |
| Text on dark sections | Soft white | #F7F5FF |
| Tiny decorative highlights | Champagne gold | #E7C98F |

Use ivory for most content sections, midnight indigo for the hero and footer, plum for dark card surfaces, lavender for accents and button backgrounds, and gold sparingly for tiny details. Use indigo text on lavender buttons. Lavender is not suitable by default for small text on ivory: use a contrast-checked darker link colour or indigo with lavender decoration. Check actual contrast before shipping.

Use flat colours, with no gradients. The two dominant page backgrounds are ivory and indigo; strict alternation between every section is not required. Preserve the reference’s visual rhythm through spacing, composition and contrast.

Typography: Unbounded 700–800 for expressive headings; Plus Jakarta Sans 400–600 for body text; Mrs Saint Delafield only for the handwritten signature or small personal notes. Use tight heading tracking around -0.03em without compromising readability. Project captions stay modest: approximately 16px semibold titles and 13px secondary descriptions, never huge bold names.

Use generous desktop vertical padding around 96–170px, scaled appropriately for mobile. Side gutters should behave like clamp(24px, 6vw, 96px). Make the interface feel finished at 390px and 1440px, and usable at 320px, tablet sizes and larger widths. No accidental page-level horizontal overflow.

## 4. Public routes and navigation

The main experience is one long homepage. About, experience, community and contact are homepage sections rather than separate top-level pages.

- `/`: complete homepage.
- `/projects/frontend`: all published Front End Engineering projects.
- `/projects/data-analysis`: all published Data Analysis projects.
- `/projects/[slug]`: individual project or case-study page.
- `/articles`: article listing, including internal articles and external article previews.
- `/articles/[slug]`: full internally published article.
- `/admin/login`: owner login.
- `/admin/*`: protected management interface.

Provide section anchors, accessible navigation and sensible back links from detail pages. Each role has its own homepage project section and its own View more link. Do not combine both roles into an undifferentiated project gallery.

## 5. Site-wide role modes — essential behaviour

The admin has two switches: Front End Engineering enabled, and Data Analysis enabled. Both start enabled. Prevent a state where both are disabled, including server-side validation.

Support three complete public modes:
1. Combined: equal emphasis for both disciplines, with separate project sections.
2. Engineering only: the entire public portfolio presents Hassana as a Front End Engineer.
3. Data Analysis only: the entire public portfolio presents Hassana as a Data Analyst.

Role changes must affect hero titles, ID card front/back, rotating phrases, introductions, navigation, services, skills/tool strip, projects, articles, relevant experience, CV options, contact wording where applicable, SEO metadata and sitemap entries. Shared personal/community content can remain visible.

Store editable hero and introduction variants for all three modes. Do not merely remove one title and leave contradictory wording elsewhere. Combined hero words are **ENGINEER / ANALYST / TUTOR / BUILDER**. Single-role variants must remove the inactive role word and remain editable; use clearly marked sample alternatives initially.

Tag content with Engineering, Data Analysis, both, or General where appropriate. General content remains available in either mode. Define one central visibility resolver and use it consistently across listings, detail routes, search/filter results and metadata.

Disabling a role preserves its content in admin. Direct public requests for inactive-role-only detail pages and listings should return a proper unavailable/404 response and must not leak their content through public APIs. Re-enabling restores eligible published content. Role changes follow draft/preview/publish and update all affected caches after publication.

## 6. Homepage design and interactions

### A. Hanging ID card hero

Use a full-viewport indigo intro with four huge lavender words arranged around a central hanging badge. On desktop, balance two near the upper part and two near the lower part; on mobile, place two above and two below without collisions.

The card hangs from a lavender lanyard descending from the top. Include a clear plastic holder, rounded corners, oval slot, metal clip and subtle depth. Approximate card width: min(66vw, 380px), with ratio 1:1.41; adjust at small sizes for legibility.

Front: editable portrait, Hassana’s name, active professional title, optional availability pill, handwritten signature, small decorative barcode and ID label. Back: concise What I do rows relevant to active roles, short personal line and optional social handle. All meaningful text and images are admin-managed. Decorative elements are hidden from screen readers.

Entrance: masked words rise into view with about 110ms stagger; lanyard and badge drop with a spring overshoot and a short settling swing, around 2.4 seconds total. First automatic flip around 3.1 seconds, then about every 3.6 seconds, with a smooth approximately 0.95-second Y-axis rotation. Clicking, tapping or using the keyboard flips the card and resets the timer. Provide a way to pause automatic motion; do not let auto-flips interrupt focus or reading. Reduced-motion mode disables automatic flipping and decorative entrance motion while preserving access to both sides.

Bottom-left: editable cycling phrases about active work. Bottom-right: Scroll indicator. Gentle scroll parallax may move/fade the hero words. Keep primary content available if animations fail.

### B. Floating navigation

A centred frosted pill with Hassana’s editable text mark, section links and a Contact me pill. Hide it during the opening intro and reveal it around 70% past the intro, then keep it available. Use indigo-tinted translucent surfaces, subtle borders and blur. Provide an accessible mobile menu. Do not obscure the hero words or keyboard focus.

### C. About/photo collage

Two columns: overlapping portrait/workspace images on one side, a short mode-appropriate introduction on the other. Use slight photo rotations, flat offset shadows, a handwritten greeting and a restrained heading reveal. On mobile stack naturally. Include optional expandable personal details within this section instead of repeating two near-identical About sections.

### D. What I do

Large separated rows with an icon tile, role/service heading and short description. Initial themes: frontend interfaces and web applications; data cleaning, analysis and dashboards; tutoring/building where relevant. Admin can add, edit, reorder, hide and assign role scope to rows. Use alternating directional reveals, with small icon rotation and heading movement on hover.

### E. Skills/tool strip

A single thin seamless marquee with small tool names and optional icons, rather than oversized logos. Use active-role tools only. Pause on hover/focus and expose a pause control where needed. Reduced motion shows a static wrapping list. All items are editable.

### F. Front End Engineering selected work

Its own heading, short intro, horizontal image-led gallery, subtle progress bar and View more link to the engineering listing. Use rounded approximately 22px cards, soft shadows and captions below images, not labels over thumbnails. Give headings 40–64px of space before images.

On suitable desktop screens, pin the section while ordinary vertical scrolling advances the gallery horizontally. Cards slightly scale/tilt away from centre. Do not trap scrolling. Support keyboard navigation and visible controls; on mobile use native horizontal scrolling/swiping or an accessible stacked alternative. Reduced motion uses a normal gallery. Recalculate distances when the gallery changes and avoid pinning very short galleries unnecessarily.

### G. Data Analysis selected work

A separate section of equal visual importance, with the same gallery language and its own View more link. Use readable dashboard/project images, not engineering website placeholders. Follow the same accessibility and mobile rules.

### H. Additional optional sections

Include these admin-controlled section types:
- Work experience and education.
- Community involvement, teaching and speaking.
- Certifications and achievements.
- Testimonials.

All may be included, excluded, edited and reordered. Empty sections and their navigation links disappear gracefully. Testimonials used as demo data must be explicitly labelled as samples, never invented endorsements presented as real. Do not include a statistics section by default; no unverified numerical claims.

### I. Articles preview

Show a manageable number of recent/featured articles, with a View more link to `/articles`. Internal articles open their detail pages; external entries have a clear external-link cue and lead to the configured platform. Filter according to published role visibility.

### J. Contact and footer

Use a large, editable invitation heading, contact form, email link and social links. No floating WhatsApp button by default. Form fields: name, email, optional subject and message. Store enquiries in a private admin inbox. Support email notifications through a separately configured server-side email provider; do not assume Supabase itself sends arbitrary contact notifications.

Show successful submission only after the message has been persisted. A notification failure must not discard the message or falsely report failure of a successfully saved enquiry. Add validation, abuse protection and accessible error messages. Footer includes editable name, current year, links and Back to top.

## 7. Project templates

Every project supports title, slug, summary, role/category, featured state, display order, cover image and alt text, gallery, draft/published status and SEO fields. Case-study blocks and optional fields can be rearranged or omitted without leaving empty headings.

Engineering template:
- Overview and problem solved.
- Hassana’s role and contributions.
- Technologies and key features.
- Screenshots and optional demo video.
- Challenges, approach and outcomes when supplied.
- Optional live site and GitHub links.

Data Analysis template:
- Business question and dataset/source details.
- Data cleaning and analysis process.
- Tools and methods.
- Dashboard images and visualisations.
- Key findings and recommendations.
- Optional GitHub, dashboard and downloadable report/dataset links.
- Optional interactive dashboard embed, such as a public Power BI or Tableau embed, with a descriptive title and useful fallback image/link. Validate trusted embed providers; never accept arbitrary executable embed HTML. Warn in admin that publicly embedded dashboards must contain only information suitable for public sharing.

## 8. Articles and CVs

Article editor supports internal full articles and external-link entries. Common fields: title, slug, excerpt, cover/alt text, role tags, category, featured state, publication date and SEO. Internal articles use a structured rich-text or Markdown editor with safe rendering. External entries store their destination URL and platform. Validate URLs and sanitize rendered content.

CV manager supports Engineering, Data Analysis and combined CV files, labels, upload/replacement, visibility and ordering. Admin decides which eligible CVs appear. The active mode filters options; a combined CV must not automatically appear in single-role mode because it may mention the disabled discipline. Allow explicit per-mode CV configuration. Hide empty download controls.

## 9. Admin dashboard and content model

Create a clean, responsive owner dashboard with navigation for Overview, Site modes, Homepage/sections, Projects, Articles, Experience/education, Community/teaching, Certifications, Testimonials, Media, CVs, Messages and Settings.

The owner can:
- Edit all public copy, labels, navigation text, images, contact/social links, availability, brand text and metadata.
- Manage all three role-mode content variants.
- Add, edit, delete, archive, feature and reorder projects/articles and other records.
- Show/hide sections, rearrange them with drag-and-drop plus keyboard-accessible move controls, and insert new sections from predefined templates.
- Use templates such as text/image, gallery, service rows, timeline, cards, testimonials and article/project previews. This is a structured section builder; arbitrary new code/layout types still require development.
- Adjust theme tokens within sensible constraints, with a contrast preview/warning.
- Upload and replace photos, thumbnails, documents and supported videos; manage alt text.
- Read, mark read/unread, archive and delete enquiries.
- Preview desktop and mobile layouts and every role mode before publishing.

Use an explicit typed relational schema with suitable constraints/indexes. Suggested entities include site settings and their revisions, mode profiles, section instances/revisions, projects/revisions, articles/revisions, skills/services, experience/education, community entries, certifications, testimonials, media, CVs and enquiries. Use validated structured JSON for variable section blocks, not a single unvalidated document for the entire application.

## 10. Draft, preview and publishing

Saving drafts must not modify live content. Maintain independent draft and published revisions, including edits to records that are already live. Public reads resolve only published snapshots. Preview is authenticated, non-indexable and uncached/private; draft data must never enter a shared public cache.

Provide clear Save draft, Preview, Publish and Unpublish actions. Site-wide publication should apply a coherent revision for mode settings, navigation and related copy, avoiding half-applied configurations. Individual content may publish separately if it remains consistent with the active published settings. Invalidate relevant cached pages and metadata after changes. Make save/publish failures visible without losing edits.

## 11. Starter content and starting fresh

Use removable sample data initially. Where the existing portfolios are accessible, their verified public content may be adapted as draft starter material. Do not invent experience, credentials, client quotes, outcomes or project metrics, and do not claim content was imported if it was inaccessible.

Mark sample and imported starter records explicitly, for example with `is_seed` and source metadata. Samples are not automatically credible facts. Use labelled placeholders when images or copy are missing. Do not reuse the reference owner’s phone, email, photos, projects, names or claims.

Allow the owner to delete everything manually and add content from scratch. Include a confirmed Clear starter content action that removes only records marked as starter data, with a count and scope summary. It must preserve manually created content, the owner account and unrelated settings. Broader bulk deletion, if offered, requires a separate explicit confirmation and clear scope. Never reseed deleted records on application startup or deployment. Keep a clean empty state after removal.

## 12. Security, accessibility and quality

- Owner-only administration through Supabase Auth, with public signup disabled or strictly separated from admin authorization. Signing in alone must not make someone an admin.
- Enforce authorization on every server mutation and with Supabase row-level security. Public users can only read eligible published content; drafts, enquiries and admin configuration are private. Public contact submissions cannot read the inbox.
- Enforce inactive-role visibility in public data access, not just CSS or frontend filtering.
- Use private storage for draft-only assets and sensitive files, with authorized previews. Publishing/unpublishing and role changes must handle asset exposure deliberately; do not promise previously downloaded public files can be recalled.
- Validate file types/sizes, restrict upload permissions, protect privileged credentials, sanitize article content and validate external links/embeds.
- Use semantic landmarks, proper heading order, visible focus, form labels, descriptive errors, meaningful alt text and keyboard-operable controls. Do not rely solely on colour or hover.
- Honour prefers-reduced-motion throughout, provide controls for persistent movement and prevent flashing or intrusive motion.
- Optimize responsive images, reserve media dimensions, lazy-load heavy galleries/embeds, avoid oversized base64 assets and prefer transform/opacity animation.
- Provide metadata, canonical URLs, social previews and a sitemap containing only visible published pages. Keep admin, preview and drafts out of indexing.

## 13. Build sequence and acceptance checks

Implement in reviewable stages: visual shell and components; schema/auth/security; admin CRUD and media; publishing/role modes; project/article details and contact; animation polish and verification. Do not deliver only the shell while describing unimplemented admin functionality as complete.

Verify at least:
1. Both-role mode gives each discipline its own project section and listing.
2. Publishing Engineering-only or Data-only mode updates the whole public presentation and blocks inactive-only direct routes/data access.
3. Re-enabling a role restores its saved eligible content; disabling both is rejected.
4. Saving a draft leaves the live revision unchanged; preview and publish work as described.
5. Admin can reorder/hide/add supported sections and CRUD all agreed content.
6. Clearing seed data preserves manually entered data and does not cause reseeding.
7. Internal/external articles, project details, CV eligibility and dashboard fallbacks work.
8. Unauthenticated/non-admin users cannot edit content or retrieve drafts/enquiries.
9. Contact submission persists correctly, with truthful feedback if email notifications are unconfigured or fail.
10. Mobile layouts, keyboard controls and reduced-motion alternatives remain usable, including after sections are hidden or reordered.

Deliver complete source, migrations/policies, optional seed data, environment examples, setup instructions and a short owner guide explaining role switches, publishing, section management and removing starter content. State any remaining external configuration honestly. Preserve the expressive reference design throughout instead of falling back to a generic portfolio template.
