# About introduction video

The About card reads `aboutVideo`, `aboutPoster`, `aboutImage` (fallback), and `aboutVideoDescription` from the existing site settings. Existing settings without video fields continue showing their fallback image.

The supplied original is preserved at `public/Woman_typing_and_waving_hello_20260928201615.mp4`. Run `npm run media:about` to regenerate the separate silent H.264 fast-start copy and JPEG poster from the original. The web copy is 1,161,777 bytes (about 58% smaller), 1280 × 720, eight seconds, with no audio stream. The poster uses the smiling wave at 7.2 seconds. The original's brief opening side reveal is preserved.

Demo settings select `public/demo/about-hello.mp4` and `public/demo/about-hello-poster.jpg`. For a configured Supabase site, upload these two files through **Media**, then choose them in **Site settings → About**, along with an image fallback and description. Save a draft, preview, then publish using the existing workflow. Clearing the video returns the card to its still image. Private uploaded media becomes public only when referenced by published content.

Playback loads metadata near the viewport, starts at half visibility, repeats until paused, and pauses outside the viewport or in hidden tabs. Manual pause is retained. Reduced-motion visitors see a poster until they select Play. Native buttons support keyboard activation and visible focus styles.

Validation: automated playback-policy/SSR tests, database draft/public media tests, TypeScript and production build. Extracted frames were visually inspected for face, laptop and hand framing. Actual desktop/mobile browser layout and keyboard interaction still need a browser check; browser automation surfaces were unavailable in this session. Supabase is not configured locally, so live dashboard upload/publish was not exercised.
