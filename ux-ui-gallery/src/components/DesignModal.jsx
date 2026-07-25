import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';
import { designComponents } from '../data/designComponents';
import { useDesignTextEffects } from '../hooks/useDesignTextEffects';
import ErrorBoundary from './ErrorBoundary';

// ─── Animated Title Component ──────────────────────────────────────────────────

function AnimatedModalTitle({ text, design, skill }) {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const el = ref.current;
    if (!el) return;

    setHasAnimated(true);
    const letters = el.querySelectorAll('.title-letter');
    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: letters,
        translateY: [30, 0],
        opacity: [0, 1],
        rotateX: [90, 0],
        duration: 500,
        delay: anime.stagger(30),
      });
  }, [hasAnimated]);

  const letters = text.split('').map((char, i) => (
    <span
      key={i}
      className="title-letter inline-block"
      style={{ opacity: 0, fontFamily: design?.fonts?.heading || 'inherit' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <h2 ref={ref} id="modal-title" className="text-xl md:text-2xl font-semibold">
      {letters}
    </h2>
  );
}

// ─── Typewriter Subtitle ───────────────────────────────────────────────────────

function TypewriterSubtitle({ text, design }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <p className="text-sm" style={{ color: design?.colors?.text || '#6B7280' }}>
      {displayed}
      {!done && <span className="animate-pulse" style={{ color: design?.colors?.primary || '#3B82F6' }}>|</span>}
    </p>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

function ModalLoadingSkeleton({ design }) {
  return (
    <div className="p-6 space-y-6 animate-pulse" style={{ backgroundColor: design?.colors?.background || '#FFFFFF' }}>
      {/* Title bar skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: (design?.colors?.primary || '#E5E7EB') + '30' }} />
        <div className="space-y-2 flex-1">
          <div className="h-6 rounded w-3/4" style={{ backgroundColor: (design?.colors?.primary || '#E5E7EB') + '20' }} />
          <div className="h-4 rounded w-1/2" style={{ backgroundColor: (design?.colors?.primary || '#E5E7EB') + '15' }} />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-8 rounded w-1/3" style={{ backgroundColor: (design?.colors?.primary || '#E5E7EB') + '15' }} />
        <div className="h-4 rounded w-full" style={{ backgroundColor: (design?.colors?.primary || '#E5E7EB') + '10' }} />
        <div className="h-4 rounded w-5/6" style={{ backgroundColor: (design?.colors?.primary || '#E5E7EB') + '10' }} />
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-xl" style={{ backgroundColor: (design?.colors?.primary || '#E5E7EB') + '10' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main DesignModal ──────────────────────────────────────────────────────────

export default function DesignModal({ 
  design, 
  isOpen, 
  onClose, 
  onDownload,
  layoutId 
}) {
  const modalRef = useRef(null);
  const titleBarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { applyTextEffects } = useDesignTextEffects(design?.skill || 'default');

  // Simulate loading for dynamic components
  useEffect(() => {
    if (!isOpen || !design) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [isOpen, design?.slug]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements?.[0];
      const lastFocusable = focusableElements?.[focusableElements.length - 1];
      
      firstFocusable?.focus();
      
      const handleTab = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      };
      
      document.addEventListener('keydown', handleTab);
      return () => {
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !design) return null;

  const Component = designComponents[design.slug] || designComponents.default;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => { if (e.target === modalRef.current) onClose(); }}
      >
        <motion.div
          layoutId={`${layoutId}-${design.id}`}
          ref={titleBarRef}
          className="relative w-full max-w-6xl max-h-[90vh] md:max-h-[95vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Title Bar */}
          <motion.header
            className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-200"
            layoutId={`${layoutId}-titlebar-${design.id}`}
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Minimize and return to gallery"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              <div>
                <AnimatedModalTitle text={design.title} design={design} skill={design.skill} />
                <TypewriterSubtitle text={`${design.skill} • ${design.category}`} design={design} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Download Button */}
              <motion.button
                onClick={() => onDownload(design)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Download ${design.title} template`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </motion.button>
            </div>
          </motion.header>

          {/* Design Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] md:max-h-[calc(95vh-80px)]">
            {isLoading ? (
              <ModalLoadingSkeleton design={design} />
            ) : (
              <ErrorBoundary design={design}>
                <Component design={design} />
              </ErrorBoundary>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}