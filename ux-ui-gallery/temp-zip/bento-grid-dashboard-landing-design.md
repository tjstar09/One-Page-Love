# Bento Grid Dashboard Landing - Design Specification

## Overview
Modular grid layout with card-like blocks of varying sizes showcasing features, metrics, and testimonials. Soft peach/cream palette (#FAD4C0, #FFF5E6) with Inter font.

## Visual Language
This design demonstrates the **bento** skill within the **Landing Pages & Marketing** category.

## Color System
| Role | Value | Usage |
|------|-------|-------|
| Primary | #FAD4C0 | Main brand actions, key highlights |
| Background | #FFF5E6 | Page/card backgrounds |
| Text | #2D2D2D | Primary text content |
| Accent | #FF8C66 | Secondary actions, hover states |

## Typography Scale
- **Headings**: Inter, system-ui, sans-serif
- **Body**: Inter, system-ui, sans-serif

## Interactive Components
1. Card hover lift + subtle shadow
2. Grid reflow on resize
3. Metric counter animation on scroll
4. Feature card flip on click
5. Filter tabs

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