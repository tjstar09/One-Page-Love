import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryView from './components/GalleryView';
import DesignModal from './components/DesignModal';
import { designTemplates } from './data/designTemplates';
import { searchPexelsImage } from './utils/pexels';
import './App.css';

export default function App() {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [galleryScrollPosition, setGalleryScrollPosition] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  // Preload images for all designs
  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      try {
        await Promise.all(
          designTemplates.map(design => 
            searchPexelsImage(design.pexelsQuery)
              .then(photo => {
                if (mounted) {
                  setImagesLoaded(prev => ({ ...prev, [design.id]: photo }));
                }
              })
          )
        );
      } catch (error) {
        console.error('Error preloading images:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadImages();
    return () => { mounted = false; };
  }, []);

  // View counter - persist in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ux-ui-gallery-views');
    const count = stored ? parseInt(stored, 10) + 1 : 1;
    localStorage.setItem('ux-ui-gallery-views', count.toString());
    setViewCount(count);
  }, []);

  // Track scroll position for "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDesignClick = useCallback((design, index) => {
    // Save scroll position before opening modal
    setGalleryScrollPosition(index * 320);
    setSelectedIndex(index);
    setSelectedDesign(design);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDesign(null);
  }, []);

  const handleDownload = useCallback((design) => {
    // Navigate directly to the pre-compiled zip file
    const zipUrl = design.downloadUrl;
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `${design.slug}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const layoutId = 'design-gallery';

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="app min-h-screen bg-white">
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-live="polite"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full mx-auto mb-6"
                style={{ borderTopColor: designTemplates[0]?.colors?.primary || '#3B82F6' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
              <p className="text-gray-600 text-lg font-medium">Loading Design Gallery...</p>
              <p className="text-gray-400 text-sm mt-2">Fetching images from Pexels</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="min-h-screen"
      >
        {/* Hero Header */}
        <header className="relative px-6 py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20" 
                 style={{ backgroundColor: designTemplates[0]?.colors?.primary || '#3B82F6' }} />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20" 
                 style={{ backgroundColor: designTemplates[1]?.colors?.primary || '#FAD4C0' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" 
                 style={{ backgroundColor: designTemplates[2]?.colors?.primary || '#5D4432' }} />
          </div>

          <div className="relative max-w-6xl mx-auto text-center">
            {/* View Counter */}
            <motion.div
              className="absolute top-4 right-4 md:static md:absolute md:top-6 md:right-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                   style={{ 
                     backgroundColor: designTemplates[0]?.colors?.primary + '15', 
                     color: designTemplates[0]?.colors?.primary || '#3B82F6',
                     border: `1px solid ${designTemplates[0]?.colors?.primary}33`
                   }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{viewCount.toLocaleString()} views</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ 
                backgroundColor: designTemplates[0]?.colors?.primary + '20', 
                color: designTemplates[0]?.colors?.primary || '#3B82F6' 
              }}
            >
              <span>✨</span> UX/UI Design Template Gallery
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}
            >
              Discover{' '}
              <span style={{ color: designTemplates[0]?.colors?.primary || '#3B82F6' }}>
                78 Design Templates
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Explore a curated collection of UX/UI design templates showcasing distinct visual languages 
              and interactive patterns. Each template demonstrates a unique design skill — from agentic AI 
              interfaces to cozy café landings, brutalist dashboards to immersive 3D experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {['Landing Pages', 'Dashboards', 'Applications', 'Editorial', 'Experimental'].map((cat, i) => (
                <motion.span
                  key={cat}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: designTemplates[i % 3]?.colors?.primary + '15', 
                    color: designTemplates[i % 3]?.colors?.primary || '#3B82F6',
                    border: `1px solid ${designTemplates[i % 3]?.colors?.primary}33`
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {cat}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </header>

        {/* Cover Flow Gallery */}
        <section className="px-6 py-8 md:py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}>
                Browse Templates
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Navigate with arrow keys, mouse wheel, or drag/swipe. Click a tile or the maximize button to explore the full interactive design.
              </p>
            </motion.div>

            <div className="gallery-section">
              <GalleryView
                designs={designTemplates}
                onDesignClick={handleDesignClick}
                selectedIndex={selectedIndex}
                onIndexChange={setSelectedIndex}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}>
                  UX/UI Design Gallery
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A showcase of 78 unique design templates, each representing a distinct visual language 
                  and interaction pattern. Built with React, Framer Motion, and Tailwind CSS.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Landing Pages & Marketing (18)</li>
                  <li>Dashboards & Data (12)</li>
                  <li>Applications & Tools (16)</li>
                  <li>Content & Editorial (10)</li>
                  <li>Experimental & Playful (22)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Tech Stack</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>React 19 + Vite</li>
                  <li>Tailwind CSS v4</li>
                  <li>Framer Motion 11</li>
                  <li>Pexels API for imagery</li>
                  <li>Custom cover-flow engine (animejs)</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: '#E5E7EB' }}>
              <p className="text-sm text-gray-500">
                © 2024 UX/UI Design Gallery. All design templates are for showcase purposes.
              </p>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Documentation</a>
                <a href="#" className="hover:text-gray-900 transition-colors">License</a>
              </div>
            </div>
          </div>
        </footer>
      </motion.main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {scrollY > 100 && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Design Modal */}
      <DesignModal
        design={selectedDesign}
        isOpen={!!selectedDesign}
        onClose={handleCloseModal}
        onDownload={handleDownload}
        layoutId={layoutId}
      />
    </div>
  );
}