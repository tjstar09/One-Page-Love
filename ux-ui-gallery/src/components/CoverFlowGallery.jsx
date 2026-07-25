import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import DesignTile from './DesignTile';

export default function CoverFlowGallery({ 
  designs, 
  onDesignClick, 
  selectedIndex = 0,
  onIndexChange 
}) {
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const [wheelTimeout, setWheelTimeout] = useState(null);
  
  // Scroll position state (for persistence)
  const scrollX = useMotionValue(selectedIndex * 320); // 320 = tile width + gap
  const springScrollX = useSpring(scrollX, { stiffness: 200, damping: 30 });
  
  // Calculate which item is centered based on scroll
  const currentIndex = useTransform(springScrollX, [0, (designs.length - 1) * 320], [0, designs.length - 1]);
  
  // Snap to nearest item on scroll end
  const snapToItem = useCallback((index) => {
    const targetScroll = index * 320;
    scrollX.set(targetScroll);
    if (onIndexChange) onIndexChange(index);
  }, [scrollX, onIndexChange]);

  // Handle wheel scrolling - snap to next/previous item once per scroll
  const handleWheel = useCallback((e) => {
    // Only handle wheel if we're hovering the gallery
    if (!isHovering) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Debounce wheel events to prevent multiple snaps on fast scroll
    if (wheelTimeout) {
      clearTimeout(wheelTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      // Scroll down (deltaY > 0) -> next item (+1), scroll up -> previous item (-1)
      const direction = e.deltaY > 0 ? 1 : -1;
      const currentIdx = Math.round(scrollX.get() / 320);
      const newIndex = Math.max(0, Math.min(designs.length - 1, currentIdx + direction));
      snapToItem(newIndex);
    }, 50);
    
    setWheelTimeout(newTimeout);
  }, [designs.length, scrollX, snapToItem, wheelTimeout, isHovering]);

  // Handle drag start
  const handleDragStart = useCallback((e) => {
    if (!isHovering) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStart({ x: clientX, scroll: scrollX.get() });
    setIsDragging(true);
  }, [scrollX, isHovering]);

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!dragStart || !isHovering) return;
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = dragStart.x - clientX;
    const newScroll = Math.max(0, Math.min((designs.length - 1) * 320, dragStart.scroll + delta));
    scrollX.set(newScroll);
  }, [dragStart, designs.length, scrollX, isHovering]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!dragStart) return;
    setIsDragging(false);
    const index = Math.round(scrollX.get() / 320);
    snapToItem(index);
    setDragStart(null);
  }, [dragStart, scrollX, snapToItem]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keys if gallery is focused/hovered
      if (!isHovering) return;
      
      // ArrowRight -> next item (+1), ArrowLeft -> previous item (-1)
      if (e.key === 'ArrowRight') {
        const index = Math.min(designs.length - 1, Math.round(scrollX.get() / 320) + 1);
        snapToItem(index);
      } else if (e.key === 'ArrowLeft') {
        const index = Math.max(0, Math.round(scrollX.get() / 320) - 1);
        snapToItem(index);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const index = Math.round(scrollX.get() / 320);
        if (designs[index]) onDesignClick(designs[index], index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [designs, scrollX, snapToItem, onDesignClick, isHovering]);

  // Sync scroll position when selectedIndex changes externally
  useEffect(() => {
    scrollX.set(selectedIndex * 320);
  }, [selectedIndex, scrollX]);

  // Cleanup wheel timeout
  useEffect(() => {
    return () => {
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [wheelTimeout]);

  // Track width: each item ~320px + gap-8 (32px) + px-20 (80px padding)
  const itemWidth = 320;
  const gap = 32; // gap-8
  const padding = 80; // px-20
  const containerWidth = designs.length * itemWidth + (designs.length - 1) * gap + padding;

  // Current centered index
  const centeredIndex = Math.round(scrollX.get() / 320);

  return (
    <div 
      ref={containerRef}
      className="gallery-viewport"
      onWheel={handleWheel}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Gallery boundary - clear visible box with fade effect */}
      <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
        {/* Visible border box */}
        <div className="absolute inset-0 border-2 border-gray-300/60 rounded-xl shadow-lg" 
             style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 40px -10px rgba(0,0,0,0.1)' }} />
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-xl" />
      </div>

      {/* Background gradient overlay on sides */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white to-transparent" />
      </div>

      {/* FIXED CENTER FRAME - visible box around centered item */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none" aria-hidden="true">
        <div className="w-[340px] h-[440px] md:w-[380px] md:h-[480px] rounded-2xl border-2 border-primary/30 bg-primary/5 shadow-xl"
             style={{ 
               boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1), 0 20px 60px -15px rgba(59, 130, 246, 0.2)',
               borderColor: designs[centeredIndex]?.colors?.primary || '#3B82F6',
             }}>
          {/* Center indicator */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full bg-primary text-white shadow-lg">
            FOCUS
          </div>
          {/* Corner brackets */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary/60 rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary/60 rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary/60 rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary/60 rounded-br-xl" />
        </div>
      </div>

      {/* Cover flow track */}
      <motion.div
        className="gallery-track flex h-full items-center gap-8 px-20"
        style={{ 
          width: containerWidth,
          x: springScrollX,
        }}
        role="listbox"
        aria-label="Design template gallery"
      >
        {designs.map((design, index) => {
          const isCentered = index === centeredIndex;
          const isAdjacent = Math.abs(index - centeredIndex) === 1;
          
          return (
            <motion.div
              key={design.id}
              role="option"
              aria-selected={isCentered}
              aria-label={design.title}
              style={{
                x: useTransform(springScrollX, [index * 320 - 160, index * 320, index * 320 + 160], [-40, 0, 40]),
                scale: useTransform(springScrollX, [index * 320 - 160, index * 320, index * 320 + 160], [0.85, 1, 0.85]),
                zIndex: useTransform(springScrollX, [index * 320 - 160, index * 320, index * 320 + 160], [1, 10, 1]),
                opacity: useTransform(springScrollX, [index * 320 - 480, index * 320 - 160, index * 320 + 160, index * 320 + 480], [0, 1, 1, 0]),
              }}
            >
              <DesignTile 
                design={design} 
                index={index}
                isActive={isCentered}
                isFocused={isCentered}
                isAdjacent={isAdjacent}
                onClick={isCentered 
                  ? () => onDesignClick(design, index) 
                  : () => snapToItem(index)  // Click non-focused tile to focus it
                }
                style={{ pointerEvents: 'auto' }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom Navigation - arrows positioned left/right of center, dots in center */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-30">
        <div className="flex items-center justify-between px-8 pb-4">
          {/* LEFT BUTTON - Previous (moves tiles right, shows previous item) */}
          <button
            onClick={() => snapToItem(Math.max(0, Math.round(scrollX.get() / 320) - 1))}
            aria-label="Previous design"
            disabled={Math.round(scrollX.get() / 320) === 0}
            style={{ opacity: Math.round(scrollX.get() / 320) === 0 ? 0.4 : 1, pointerEvents: Math.round(scrollX.get() / 320) === 0 ? 'none' : 'auto' }}
            className="pointer-events-auto w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots indicator - centered */}
          <div className="nav-dots pointer-events-auto flex items-center gap-2">
            {designs.map((_, index) => {
              const dotScale = useTransform(springScrollX, [index * 320 - 160, index * 320, index * 320 + 160], [1, 1.5, 1]);
              const dotBackground = useTransform(springScrollX, [index * 320 - 160, index * 320, index * 320 + 160], ['#d1d5db', '#3b82f6', '#d1d5db']);
              
              return (
                <motion.button
                  key={index}
                  className="w-2 h-2 rounded-full transition-colors"
                  onClick={() => snapToItem(index)}
                  aria-label={`Go to ${designs[index].title}`}
                  aria-current={index === centeredIndex ? 'true' : 'false'}
                  style={{ 
                    backgroundColor: dotBackground,
                    scale: dotScale,
                  }}
                />
              );
            })}
          </div>

          {/* RIGHT BUTTON - Next (moves tiles left, shows next item) */}
          <button
            onClick={() => snapToItem(Math.min(designs.length - 1, Math.round(scrollX.get() / 320) + 1))}
            aria-label="Next design"
            disabled={Math.round(scrollX.get() / 320) === designs.length - 1}
            style={{ opacity: Math.round(scrollX.get() / 320) === designs.length - 1 ? 0.4 : 1, pointerEvents: Math.round(scrollX.get() / 320) === designs.length - 1 ? 'none' : 'auto' }}
            className="pointer-events-auto w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}