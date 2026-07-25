# Agentic AI Chat Landing - Design Specification

## Overview
A conversational AI-first landing page with a central chat interface, minimal chrome, and clear outcome-oriented CTAs. Warm orange accent (#FF5701) on cream background with Playfair Display typography.

## Visual Language
This design demonstrates the **agentic** skill within the **Landing Pages & Marketing** category.

## Color System
| Role | Value | Usage |
|------|-------|-------|
| Primary | #FF5701 | Main brand actions, key highlights |
| Background | #FFF8F0 | Page/card backgrounds |
| Text | #1A1A2E | Primary text content |
| Accent | #FF8C42 | Secondary actions, hover states |

## Typography Scale
- **Headings**: Playfair Display, serif
- **Body**: Inter, system-ui, sans-serif

## Interactive Components
1. Expandable chat bubbles
2. Typing indicator animation
3. CTA button hover/focus states
4. Slide-up onboarding carousel
5. Reduced-motion toggle

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Accessibility
- Semantic HTML structure
- Focus management
- ARIA labels on interactive elements
- Reduced motion support
- Color contrast ratios (WCAG AA)

## Assets
- Images sourced from Pexels API
- Icons from Lucide React
- Fonts from Google Fonts

## Implementation Notes
- Built with React 19 + Vite
- Styled with Tailwind CSS v4
- Animations with Framer Motion 11
- 3D Cover Flow with animejs 3.2.2