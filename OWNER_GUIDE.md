# Your portfolio studio

Open `/admin/login` after setup. `/admin/demo` is a separate, temporary demonstration when Supabase is not configured.

## Change your professional focus

In **Site modes**, enable Engineering, Data Analysis, or both. At least one must stay enabled. Edit each profile's title, four hero words, cycling phrases, introduction, badge-back rows, contact heading and search description. Single-role sample words are editable alternatives.

**Save draft** does not change the live portfolio. Preview saved drafts in all modes before choosing **Publish site**. Disabled-role content remains in your library. Re-enabling a role restores its eligible published content.

General records appear in any mode. “Both” means the record is relevant to either discipline, not that both must be enabled. Use the appropriate role tags and wording so single-role visitors see a consistent story. CVs have separate per-mode checkboxes; only enable modes suitable for that document.

## Arrange the homepage

In **Homepage / sections**, drag sections or use Move up / Move down. Open a section to edit its label, heading, introduction, role scope and anchor. Use its visibility switch to hide it. Insert new sections from the supported templates. Remove affects the layout draft until publication.

Project previews show featured projects for their discipline. **What I do / Services** and **Tools / Skills** are also available as direct dashboard tabs. Empty data-driven sections and their navigation links disappear automatically. Keep at least three featured projects in a role to see desktop scroll pinning; shorter galleries use normal horizontal scrolling. Mobile and reduced-motion layouts use native scrolling and arrow controls.

## Add work, writing and other records

Choose a library and **Add**. Fill in its title, slug, scope and summary. A slug uses lowercase words separated by hyphens. Published slugs must be unique within their content type. `frontend` and `data-analysis` are reserved project listing slugs.

Project content blocks can be reordered and removed. For engineering, describe the problem, contributions, technology, screenshots and outcomes you can substantiate. For analysis, use blocks for the business question, data source, cleaning, methods, findings and recommendations. Add trusted dashboard embeds only for information suitable for public sharing, with a title and cover-image fallback. Use links for GitHub, live sites, reports and videos.

Use **Add Engineering outline** or **Add Data Analysis outline** to insert suggested blocks. Empty blocks are omitted publicly. Uploaded MP4 videos support an accessible title and native playback controls; include a text transcript for essential spoken content.

For articles, leave the external URL blank to publish internal Markdown. To link to an existing article, add its HTTPS URL and platform. Raw HTML is never executed. Use managed image blocks instead of Markdown image syntax.

For the supplied case-study drafts, run supabase/scripts/update_dechi_htf_story.sql after the Dechi HTF import to add its 2024 story while preserving its media and links. Run supabase/scripts/add_collaboration_projects.sql to add the Women Techmakers community sprint, G3Women Digital Academy team contribution, Saqo frontend collaboration and the Hashnode article as separate drafts. These scripts do not publish or overwrite matching records. The Women Techmakers article could not be inspected automatically, so its three live site URLs are left for you to add as project links after confirming them.

Prepared local project covers are available in public/demo: mentoraft-cover-light.png, women-techmakers-sprint-cover.png, g3women-academy-cover.png and saqo-frontend-cover.png. The public read path uses these only when the corresponding published project has no cover; an uploaded Supabase asset takes precedence. Upload and select the same files in Admin > Media and Projects when you are ready to replace the local fallback.

To add the three featured Hashnode articles, run supabase/scripts/add_featured_hashnode_articles.sql. It creates the Women Techmakers sprint article, the Africa's Talking SMS API article and Browser to Beyond as featured drafts, leaving them unpublished until you review them.

**Preview current edits** shows a record before saving. **Save draft** preserves the live version. **Publish** updates it. **Unpublish** removes it publicly without deleting it. Archive hides it while preserving its revisions; Restore makes its existing publication eligible again. Delete permanently removes the record after confirmation.

Use display order to reorder records (smaller first). Mark featured projects for homepage galleries. Articles use publication dates on the listing. Sample testimonials must remain visibly labelled; do not publish invented endorsements as real.

## Media and CVs

Upload files in **Media**, adding meaningful alt text. Select the uploaded file in the content editor. Replacing media means uploading a new file and publishing the changed reference, so live pages retain the original until you are ready.

For the hanging ID card and About section, go to **Settings → ID card & About media** after uploading:

| Position | Settings field | Existing local file you can upload |
| --- | --- | --- |
| Hanging ID card photo | ID portrait + Portrait alt text | `public/demo/about.jpg` |
| About still image | About image fallback + fallback alt text | `public/demo/about.jpg` |
| About video | About introduction video (silent MP4) | `public/demo/about-hello.mp4` |
| About video still/poster | About video poster + video/poster description | `public/demo/about-hello-poster.jpg` |

Reuse an existing upload by selecting it; you do not need to upload it twice. **Save draft** lets you preview; **Publish site** applies the media choices to the public homepage. Uploading a file or publishing a project does not publish site settings. While those media fields are empty, the public page keeps the local `/demo` portrait, About image, video and poster visible; selecting an uploaded Supabase asset replaces each local fallback automatically.

The QR on the back of the card downloads the first published CV eligible for the active mode: Combined, Engineering or Data Analysis. Add separate CV records in **CVs**, select the correct mode checkboxes, publish them, then publish the site settings. If no CV is eligible for the current mode, the card displays a small setup note instead of linking to a social profile.

In **CVs**, choose a PDF, label, order, role and each allowed mode. Publishing a combined CV does not automatically enable it in single-role presentations. Empty download controls stay hidden.

## Messages

Messages appear only after successful database persistence. Mark them read/unread, archive, restore, or confirm permanent deletion. The notification status says whether the optional email notification was sent, failed, or is unconfigured. A failed email notification does not lose the message.

## Start fresh

Overview shows the number and scope of starter records. Type **CLEAR STARTER CONTENT** to remove only marked samples/imports. Your own records, owner account, uploaded media and settings are preserved. No startup or deployment automatically reseeds anything. Edit sample homepage copy separately in Settings and Site modes.

The sample installer is optional and runs only when explicitly requested from an empty library. It adds drafts, never automatically publishes them. If you already have projects and want the remaining labelled demo content, run `supabase/scripts/seed_demo_content.sql` in Supabase SQL Editor. It skips projects and CVs, preserves matching records, marks the inserted service, tool, experience, community, certification, testimonial and article rows as starter data, and publishes those rows so empty sections can render immediately. You can edit, unpublish, archive, or delete them from the dashboard.
