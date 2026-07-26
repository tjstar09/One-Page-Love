import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryView from './components/GalleryView';
import DesignModal from './components/DesignModal';
import { designTemplates, designCategories } from './data/designTemplates';
import { searchPexelsImage } from './utils/pexels';
import './App.css';

// ─── Favorites persistence ─────────────────────────────────────────────────────
const FAVORITES_KEY = 'ux-ui-gallery-favorites';
function loadFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}
function saveFavorites(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

// ─── URL state persistence ─────────────────────────────────────────────────────
function getInitialIndexFromURL() {
  try {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('design-')) {
      const slug = hash.replace('design-', '');
      const idx = designTemplates.findIndex(d => d.slug === slug);
      if (idx >= 0) return idx;
    }
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get('index'), 10);
    if (!isNaN(idx) && idx >= 0 && idx < designTemplates.length) return idx;
  } catch {}
  return 0;
}

export default function App() {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(getInitialIndexFromURL());
  const [galleryScrollPosition, setGalleryScrollPosition] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  
  // ── Filtering & Search ──
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSkill, setActiveSkill] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(loadFavorites);

  // ── Persist favorites ──
  useEffect(() => { saveFavorites(favoriteIds); }, [favoriteIds]);

  // ── Update URL when selected index changes ──
  useEffect(() => {
    const design = designTemplates[selectedIndex];
    if (design) {
      const url = new URL(window.location);
      url.searchParams.set('index', selectedIndex.toString());
      url.hash = `design-${design.slug}`;
      window.history.replaceState({}, '', url.toString());
    }
  }, [selectedIndex]);

  // ── Unique skills list ──
  const uniqueSkills = useMemo(() => {
    const skills = [...new Set(designTemplates.map(d => d.skill))];
    return skills.sort();
  }, []);

  // ── Filtered designs ──
  const filteredDesigns = useMemo(() => {
    let list = designTemplates;
    
    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(d => d.category === activeCategory);
    }
    
    // Skill filter
    if (activeSkill !== 'all') {
      list = list.filter(d => d.skill === activeSkill);
    }
    
    // Search filter (title, skill, description, category, colors, interaction elements)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d => 
        d.title.toLowerCase().includes(q) ||
        d.skill.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        // Search by color hex values
        Object.values(d.colors).some(color => color.toLowerCase().includes(q)) ||
        // Search by color names
        Object.keys(d.colors).some(name => name.toLowerCase().includes(q)) ||
        // Search by interaction elements
        d.interactiveElements.some(el => el.toLowerCase().includes(q)) ||
        // Search by font names
        Object.values(d.fonts).some(font => font.toLowerCase().includes(q))
      );
    }
    
    // Favorites filter
    if (showFavoritesOnly) {
      list = list.filter(d => favoriteIds.includes(d.id));
    }
    
    return list;
  }, [activeCategory, activeSkill, searchQuery, showFavoritesOnly, favoriteIds]);

  // ── Preload images ──
  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      try {
        await Promise.all(
          designTemplates.map(design => 
            searchPexelsImage(design.pexelsQuery)
              .then(photo => {
                if (mounted) setImagesLoaded(prev => ({ ...prev, [design.id]: photo }));
              })
          )
        );
      } catch (error) {
        console.error('Error preloading images:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadImages();
    return () => { mounted = false; };
  }, []);

  // ── View counter ──
  useEffect(() => {
    const stored = localStorage.getItem('ux-ui-gallery-views');
    const count = stored ? parseInt(stored, 10) + 1 : 1;
    localStorage.setItem('ux-ui-gallery-views', count.toString());
    setViewCount(count);
  }, []);

  // ── Scroll tracking ──
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Keyboard shortcut: Ctrl+F to focus search ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        if (selectedDesign) return; // Don't interfere with modal
        e.preventDefault();
        document.querySelector('[data-search-input]')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDesign]);

  const handleDesignClick = useCallback((design, index) => {
    setGalleryScrollPosition(index * 320);
    setSelectedIndex(index);
    setSelectedDesign(design);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDesign(null);
  }, []);

  const handleDownload = useCallback((design) => {
    const zipUrl = design.downloadUrl;
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `${design.slug}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const toggleFavorite = useCallback((designId) => {
    setFavoriteIds(prev => {
      const next = prev.includes(designId) 
        ? prev.filter(id => id !== designId)
        : [...prev, designId];
      saveFavorites(next);
      return next;
    });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const layoutId = 'design-gallery';

  // ── Category counts ──
  const categoryCounts = useMemo(() => {
    const counts = { all: designTemplates.length };
    designCategories.forEach(cat => {
      counts[cat] = designTemplates.filter(d => d.category === cat).length;
    });
    return counts;
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
        id="main-content"
        initial={false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="min-h-screen"
        role="main"
        tabIndex={-1}
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
          </div>
        </header>

        {/* Gallery Section */}
        <section className="px-6 py-8 md:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Controls Bar: Search + Filters + Favorites Toggle */}
            <motion.div
              className="mb-10 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Search + Favorites Toggle Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    data-search-input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, skill, or description... (Ctrl+F)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-400 focus:outline-none transition-colors text-sm bg-white"
                    aria-label="Search design templates"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Favorites Toggle */}
                <motion.button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all border-2 ${
                    showFavoritesOnly 
                      ? 'border-pink-400 bg-pink-50 text-pink-600' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={showFavoritesOnly ? 'Show all templates' : 'Show favorites only'}
                >
                  <svg className={`w-5 h-5 ${showFavoritesOnly ? 'fill-pink-400 text-pink-400' : 'text-gray-400'}`} fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{showFavoritesOnly ? 'Showing Favorites' : 'Favorites'}</span>
                  {favoriteIds.length > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      showFavoritesOnly ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {favoriteIds.length}
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Skill Filter Chips */}
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by skill">
                {[
                  { id: 'all', label: 'All Skills', count: designTemplates.length },
                  ...uniqueSkills.map(skill => ({ 
                    id: skill, 
                    label: skill.charAt(0).toUpperCase() + skill.slice(1), 
                    count: designTemplates.filter(d => d.skill === skill).length 
                  }))
                ].map((skill, i) => {
                  const skillChipColors = [
                    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6',
                    '#06B6D4', '#84CC16', '#E11D48', '#0EA5E9', '#A855F7',
                  ];
                  const chipColor = skillChipColors[i % skillChipColors.length];
                  
                  return (
                    <motion.button
                      key={skill.id}
                      onClick={() => setActiveSkill(skill.id)}
                      role="tab"
                      aria-selected={activeSkill === skill.id}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeSkill === skill.id
                          ? 'text-white shadow-sm'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
                      }`}
                      style={activeSkill === skill.id ? { backgroundColor: chipColor } : {}}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {skill.label}
                      <span className={`ml-1 px-1 py-0.5 rounded text-[10px] ${
                        activeSkill === skill.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {skill.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
                {[
                  { id: 'all', label: 'All', count: categoryCounts.all },
                  ...designCategories.map(cat => ({ id: cat, label: cat, count: categoryCounts[cat] }))
                ].map((cat, i) => {
                  // Guaranteed high-contrast colors for filter chips (works for any number of categories)
                  const chipColors = [
                    '#3B82F6', // blue
                    '#7C3AED', // violet
                    '#059669', // emerald
                    '#DC2626', // red
                    '#D97706', // amber
                    '#0891B2', // cyan
                    '#9333EA', // purple
                    '#2563EB', // royal blue
                  ];
                  const chipColor = chipColors[i % chipColors.length];
                  
                  return (
                    <motion.button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      role="tab"
                      aria-selected={activeCategory === cat.id}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat.id
                          ? 'text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900'
                      }`}
                      style={activeCategory === cat.id ? { 
                        backgroundColor: chipColor,
                      } : {}}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      {cat.label}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                        activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Results count */}
              <motion.p 
                className="text-sm text-gray-500" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {filteredDesigns.length === 0 ? (
                  <span className="text-amber-600 font-medium">No templates match your filters.</span>
                ) : (
                  <>Showing <strong>{filteredDesigns.length}</strong> of {designTemplates.length} templates</>
                )}
              </motion.p>
            </motion.div>

            {/* Gallery */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                key={`${activeCategory}-${activeSkill}-${searchQuery}-${showFavoritesOnly}`}
                designs={filteredDesigns.length > 0 ? filteredDesigns : designTemplates}
                onDesignClick={handleDesignClick}
                selectedIndex={selectedIndex}
                onIndexChange={setSelectedIndex}
                onFavoriteToggle={toggleFavorite}
                favoriteIds={favoriteIds}
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