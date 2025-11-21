# Frontend Polish & Backend Integration Plan

## Goal
Polish the Landing, Login, and Signup pages to feel handcrafted and alive, specifically enhancing the **Light Mode** experience while keeping the **Dark Mode** exactly as-is. Finally, connect the frontend authentication forms to the running backend.

## Constraints
- **Dark Mode**: MUST REMAIN UNTOUCHED.
- **Structure**: Do not change core routing or structure.
- **Colors**: Do not change the color palette.
- **Light Mode**: Make it premium (glassmorphism, better contrast).

## Proposed Changes

### 1. Navbar Polish (`src/components/Navbar.jsx`)
- **Sticky Behavior**: Add scroll listener to reduce height and add shadow/glass effect on scroll.
- **Visuals**: Add subtle bottom border/shadow for separation.
- **Animations**:
  - Entrance animation (slide down).
  - Hover slide effect for links.
  - Polished light-mode toggle.

### 2. Hero Section (`src/pages/Landing.jsx`)
- **Typography**: Staggered letter/word reveal animation for the headline.
- **Visuals**:
  - Floating soft-glow shapes (parallax effect).
  - Magnetic CTA button (scale + glow on hover).
  - Thin gradient separator between navbar and hero.

### 3. Testimonials (`src/pages/Landing.jsx` & `src/components/TestimonialCard.jsx`)
- **Carousel**:
  - Reduce speed (6-8s).
  - Pause on hover.
  - Add pagination dots.
- **Card**: Tighten spacing, add hover elevation.

### 4. Auth Pages (`src/pages/Login.jsx`, `src/pages/Signup.jsx`)
- **Design**:
  - Refine glassmorphic card for light mode.
  - Ensure dark mode remains "True Black".
- **Inputs (`src/components/Input.jsx`)**:
  - Floating labels.
  - Validation micro-interactions (shake on error).
- **Backend Integration**:
  - Connect `axios` calls to the backend API endpoints (`/api/auth/login`, `/api/auth/signup`).
  - Handle success/error states with `react-toastify`.

### 5. Global Polish (`src/index.css`)
- **Scroll**: Ensure smooth scrolling site-wide.
- **Whitespace**: Tune vertical rhythm (4/8/16 scale).

## Verification
- **Visual**: Verify Light Mode looks premium and Dark Mode is unchanged.
- **Functional**: Verify Login and Signup actually create users/tokens in the backend.
