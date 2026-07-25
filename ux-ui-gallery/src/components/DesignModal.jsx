import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { designComponents } from '../data/designComponents';
import { useDesignTextEffects } from '../hooks/useDesignTextEffects';

export default function DesignModal({ 
  design, 
  isOpen, 
  onClose, 
  onDownload,
  layoutId 
}) {
  const modalRef = useRef(null);
  const titleBarRef = useRef(null);
  const { applyTextEffects } = useDesignTextEffects(design?.skill || 'default');

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
                <motion.h2 
                  id="modal-title"
                  className="text-xl md:text-2xl font-semibold text-gray-900"
                  layoutId={`${layoutId}-title-${design.id}`}
                >
                  {design.title}
                </motion.h2>
                <motion.p 
                  className="text-sm text-gray-500"
                  layoutId={`${layoutId}-skill-${design.id}`}
                >
                  {design.skill} • {design.category}
                </motion.p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Download Button */}
              <motion.button
                onClick={onDownload}
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
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] md:max-h-[calc(95vh-80px)] p-6">
            <Component design={design} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}