# Prathosh H — Biomedical Engineering Portfolio (Gahan-inspired motion edition)

Static portfolio for GitHub + Vercel. No build step is required.

## Motion and visual features
- Kinetic split-line hero typography with staggered blur-to-sharp reveal
- Animated ECG-inspired signal trace behind the hero portrait
- Smooth Lenis scrolling when the CDN is reachable, with native-scroll fallback
- Reading-progress line, subtle cursor aura on mouse/trackpad, and restrained portrait parallax
- Scroll reveals, project image zoom, hover states, and animated dashboard metrics
- Biomedical project case studies, education timeline, hospital training, achievements and resume
- Responsive layout and `prefers-reduced-motion` support

## Publish
Extract the ZIP and upload its contents to the root of the existing GitHub repository, replacing matching files. Commit the changes. Vercel should redeploy automatically.

## Notes
The interaction style is inspired by minimal, editorial portfolio motion; it is not a pixel-for-pixel copy of another designer's site. Google Fonts and the Lenis scroll library use CDNs, so their enhanced styling requires an internet connection. Native scrolling remains available if Lenis does not load.
