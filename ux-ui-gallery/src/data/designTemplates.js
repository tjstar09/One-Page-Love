// First 3 Design Templates from design-template-gallery.md for Phase 0
// 1. Agentic AI Chat Landing (agentic skill)
// 2. Bento Grid Dashboard Landing (bento skill)
// 3. Cozy Café Lifestyle Landing (cafe skill)

export const initialDesignTemplates = [
  {
    id: 1,
    slug: 'agentic-ai-chat-landing',
    title: 'Agentic AI Chat Landing',
    skill: 'agentic',
    category: 'Landing Pages & Marketing',
    description: 'A conversational AI-first landing page with a central chat interface, minimal chrome, and clear outcome-oriented CTAs. Warm orange accent (#FF5701) on cream background with Playfair Display typography.',
    interactiveElements: [
      'Expandable chat bubbles',
      'Typing indicator animation',
      'CTA button hover/focus states',
      'Slide-up onboarding carousel',
      'Reduced-motion toggle'
    ],
    pexelsQuery: 'artificial intelligence chat interface',
    colors: {
      primary: '#FF5701',
      background: '#FFF8F0',
      text: '#1A1A2E',
      accent: '#FF8C42',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, system-ui, sans-serif',
    },
    downloadUrl: '/assets/agentic-ai-chat-landing.zip',
  },
  {
    id: 2,
    slug: 'bento-grid-dashboard-landing',
    title: 'Bento Grid Dashboard Landing',
    skill: 'bento',
    category: 'Landing Pages & Marketing',
    description: 'Modular grid layout with card-like blocks of varying sizes showcasing features, metrics, and testimonials. Soft peach/cream palette (#FAD4C0, #FFF5E6) with Inter font.',
    interactiveElements: [
      'Card hover lift + subtle shadow',
      'Grid reflow on resize',
      'Metric counter animation on scroll',
      'Feature card flip on click',
      'Filter tabs'
    ],
    pexelsQuery: 'dashboard analytics bento grid',
    colors: {
      primary: '#FAD4C0',
      background: '#FFF5E6',
      text: '#2D2D2D',
      accent: '#FF8C66',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    downloadUrl: '/assets/bento-grid-dashboard-landing.zip',
  },
  {
    id: 3,
    slug: 'cozy-cafe-lifestyle-landing',
    title: 'Cozy Café Lifestyle Landing',
    skill: 'cafe',
    category: 'Landing Pages & Marketing',
    description: 'Warm, inviting coffee shop landing with earthy tones (#5D4432, #F9F7F5), soft Poppins typography, and generous whitespace evoking a relaxed café atmosphere.',
    interactiveElements: [
      'Menu category tabs',
      'Image gallery lightbox',
      'Location map pin hover',
      'Newsletter signup with validation states',
      'Scroll-reveal steam animation'
    ],
    pexelsQuery: 'cozy coffee shop interior',
    colors: {
      primary: '#5D4432',
      background: '#F9F7F5',
      text: '#2D2D2D',
      accent: '#D4A574',
    },
    fonts: {
      heading: 'Poppins, system-ui, sans-serif',
      body: 'Poppins, system-ui, sans-serif',
    },
    downloadUrl: '/assets/cozy-cafe-lifestyle-landing.zip',
  },
];

export const designCategories = [
  'Landing Pages & Marketing',
  'Dashboards & Data',
  'Applications & Tools',
  'Content & Editorial',
  'Experimental & Playful',
];

export function getDesignById(id) {
  return initialDesignTemplates.find(d => d.id === id);
}

export function getDesignBySlug(slug) {
  return initialDesignTemplates.find(d => d.slug === slug);
}

export function getDesignsByCategory(category) {
  return initialDesignTemplates.filter(d => d.category === category);
}