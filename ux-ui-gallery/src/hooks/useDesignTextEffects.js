import { useCallback, useMemo, useEffect, useState } from 'react';

// Check if user prefers reduced motion
function getPrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Hook to check reduced motion preference
export function useReducedMotion() {
  const [reduced, setReduced] = useState(getPrefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// Text effect configurations for different design skills
const textEffects = {
  agentic: {
    heading: { className: 'font-serif tracking-tight' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-medium' },
  },
  bento: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-semibold' },
  },
  cafe: {
    heading: { className: 'font-sans tracking-normal' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-medium italic' },
  },
  clean: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-medium' },
  },
  corporate: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-semibold' },
  },
  creative: {
    heading: { className: 'font-display tracking-wide' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-bold' },
  },
  colorful: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-bold' },
  },
  contemporary: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-medium' },
  },
  cosmic: {
    heading: { className: 'font-display tracking-wider' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-bold' },
  },
  editorial: {
    heading: { className: 'font-serif tracking-tight' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-medium italic' },
  },
  enterprise: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-semibold' },
  },
  expressive: {
    heading: { className: 'font-mono tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-bold' },
  },
  fantasy: {
    heading: { className: 'font-display tracking-wide' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-bold' },
  },
  fiction: {
    heading: { className: 'font-serif tracking-normal' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-medium' },
  },
  flat: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-semibold' },
  },
  friendly: {
    heading: { className: 'font-serif tracking-normal' },
    body: { className: 'leading-relaxed' },
    accent: { className: 'font-medium' },
  },
  futuristic: {
    heading: { className: 'font-display tracking-wider' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-bold' },
  },
  glassmorphism: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-medium' },
  },
  default: {
    heading: { className: 'font-sans tracking-tight' },
    body: { className: 'leading-normal' },
    accent: { className: 'font-medium' },
  },
};

export function useDesignTextEffects(skill) {
  const effects = useMemo(() => {
    return textEffects[skill] || textEffects.default;
  }, [skill]);

  const applyTextEffects = useCallback((elementType, customClasses = '') => {
    const effect = effects[elementType] || effects.body;
    return `${effect.className} ${customClasses}`.trim();
  }, [effects]);

  const getHeadingClasses = useCallback((customClasses = '') => {
    return applyTextEffects('heading', customClasses);
  }, [applyTextEffects]);

  const getBodyClasses = useCallback((customClasses = '') => {
    return applyTextEffects('body', customClasses);
  }, [applyTextEffects]);

  const getAccentClasses = useCallback((customClasses = '') => {
    return applyTextEffects('accent', customClasses);
  }, [applyTextEffects]);

  // Scramble text effect for expressive designs
  const scrambleText = useCallback((text, options = {}) => {
    const { 
      chars = '!@#$%^&*()_+-=[]{}|;:,.<>?', 
      duration = 1000, 
      delay = 0 
    } = options;
    
    // This would be used with a component that handles the animation
    return { text, chars, duration, delay };
  }, []);

  // Typewriter effect
  const typewriterText = useCallback((text, options = {}) => {
    const { speed = 50, startDelay = 0 } = options;
    return { text, speed, startDelay };
  }, []);

  return {
    effects,
    applyTextEffects,
    getHeadingClasses,
    getBodyClasses,
    getAccentClasses,
    scrambleText,
    typewriterText,
  };
}

// Export individual effect creators for direct use
export function createScrambleEffect(text, options = {}) {
  const chars = options.chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const duration = options.duration || 1000;
  
  return {
    text,
    chars,
    duration,
    frames: Math.ceil(duration / 50),
  };
}

export function createTypewriterEffect(text, options = {}) {
  const speed = options.speed || 50;
  const startDelay = options.startDelay || 0;
  
  return {
    text,
    speed,
    startDelay,
    totalTime: text.length * speed + startDelay,
  };
}

export function createGradientText(text, colors = ['#FF5701', '#FF8C42']) {
  return {
    text,
    gradient: `linear-gradient(90deg, ${colors.join(', ')})`,
  };
}