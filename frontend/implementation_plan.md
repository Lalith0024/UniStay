# Premium UI Overhaul Plan

## Goal
Replace the "blueish" dark theme with a premium "True Black" aesthetic, implement infinite scroll testimonials, and enhance scroll animations for a consistent "Wow" experience.

## User Feedback
- Dislikes "blueish" dark theme.
- "White page sucks" (implies preference for dark or very high-end light).
- Wants consistent scrolling animations.
- Wants infinite scroll testimonials.
- Needs "Wow factor".

## Proposed Changes

### 1. Design System (`tailwind.config.js` & `index.css`)
- **Color Palette**: Switch `brandDark` from Slate (Blue-ish) to Zinc/Neutral (True Black/Gray).
  - Background: `#050505` (Almost pure black)
  - Surface: `#0a0a0a` or `#121212`
  - Accents: Keep "Cyber Teal" but ensure it pops against the black.
- **Typography**: Keep `Outfit` + `Space Grotesk`.

### 2. Landing Page (`src/pages/Landing.jsx`)
- **Hero Section**:
  - Implement a "Spotlight" or "Aurora" background effect.
  - Make the CTA button pulse or have a magnetic effect.
- **Features Section**:
  - Use `framer-motion` `whileInView` for consistent scroll triggering.
  - Add a "Bento Grid" style layout for a modern look.
- **Testimonials**:
  - Implement an infinite marquee loop (left-to-right and right-to-left).

### 3. Components
- **Navbar**: Ensure it blends seamlessly with the new black background (glassmorphism with black tint).
- **Cards**: Update glass effect to be more subtle and premium on black.

## Verification
- Build and run locally.
- Verify dark mode is "True Black" and not blue.
- Check infinite scroll smoothness.
