# Original card restoration

Branch: `fix/original-card-restoration`, based on `ab61d62`. The working tree was clean before this change. Only card components, scoped card styles, QR dependencies and verification files are changed. No settings, database data, hero background, surrounding words or video behavior were changed.

The former screenshots guide the two-line name, original portrait position, left-aligned back heading and numbered rows. The existing rig's width rules, 1:1.41 proportions, border, radius, hanging animation and flip transition are preserved. Barcode/ID clutter and back-footer duplication are removed. A small footer flip button retains focus across both sides. The signature appears once, on the front.

Existing Settings social URLs supply LinkedIn and GitHub; missing links and X are hidden. The real QR appears only in the Connect dialog so it consumes no row space. The existing signature/name fields and role variants remain the source of truth. No new accounts or migrations are introduced. Connect pauses motion and the native dialog supports Escape and restores focus when closed.

Automated verification checks card structure across role modes, safe link attributes, hidden-face focus exclusion, and decoding the rendered QR at three dialog sizes. TypeScript, tests and production build are checked. Browser automation reports no available browser, so screenshot comparison at desktop/mobile sizes, physical camera scanning, pointer/keyboard interactions and final visual overflow checks remain unverified. The screenshots were inspected as design references, not used as literal viewport/card dimensions.
