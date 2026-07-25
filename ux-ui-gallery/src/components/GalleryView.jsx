import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import anime from 'animejs';
import DesignTile from './DesignTile';

export default function GalleryView({ 
  designs, 
  onDesignClick, 
  selectedIndex = 0,
  onIndexChange 
}) {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const [centeredIndex, setCenteredIndex] = useState(selectedIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef(null);

  // Configuration constants
  const ITEM_WIDTH = 320;
  const ITEM_HEIGHT = 400;
  const MAX_VISIBLE_ITEMS = 7; // center ±3
  const PERSPECTIVE = 1000;

  // Animation parameters for each position relative to center
  const getPositionConfig = (offset) => {
    const configs = {
      0: { // Center
        translateX: 0,
        translateZ: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        filter: 'none',
      },
      1: { // Right 1
        translateX: 180,
        translateZ: -120,
        rotateY: -25,
        scale: 0.85,
        opacity: 1,
        zIndex: 5,
        filter: 'brightness(0.9)',
      },
      2: { // Right 2
        translateX: 320,
        translateZ: -240,
        rotateY: -40,
        scale: 0.7,
        opacity: 1,
        zIndex: 3,
        filter: 'brightness(0.8) grayscale(0.2)',
      },
      3: { // Right 3 (edge)
        translateX: 440,
        translateZ: -360,
        rotateY: -50,
        scale: 0.55,
        opacity: 1,
        zIndex: 1,
        filter: 'brightness(0.7) grayscale(0.4)',
      },
      '-1': { // Left 1
        translateX: -180,
        translateZ: -120,
        rotateY: 25,
        scale: 0.85,
        opacity: 1,
        zIndex: 5,
        filter: 'brightness(0.9)',
      },
      '-2': { // Left 2
        translateX: -320,
        translateZ: -240,
        rotateY: 40,
        scale: 0.7,
        opacity: 1,
        zIndex: 3,
        filter: 'brightness(0.8) grayscale(0.2)',
      },
      '-3': { // Left 3 (edge)
        translateX: -440,
        translateZ: -360,
        rotateY: 50,
        scale: 0.55,
        opacity: 1,
        zIndex: 1,
        filter: 'brightness(0.7) grayscale(0.4)',
      },
    };
    return configs[offset] || configs[3];
  };

  // Animate items to their positions
  const animateToIndex = useCallback((targetIndex, immediate = false) => {
    if (isAnimating && !immediate) return;
    if (targetIndex < 0 || targetIndex >= designs.length) return;

    setIsAnimating(true);
    const container = containerRef.current;
    if (!container) return;

    // Clean up any existing animation
    if (animationRef.current) {
      anime.remove(animationRef.current);
    }

    const items = itemsRef.current;
    const duration = immediate ? 0 : 600;
    const easing = 'cubicBezier(0.25, 0.46, 0.45, 0.94)';

    // Create animation timeline
    const timeline = anime.timeline({
      duration,
      easing,
      complete: () => {
        setIsAnimating(false);
        animationRef.current = null;
      },
    });

    // Animate each visible item
    designs.forEach((design, index) => {
      const itemEl = items[index];
      if (!itemEl) return;

      const offset = index - targetIndex;
      
      // Only animate items within visible range
      if (Math.abs(offset) > 3) {
        // Hide items outside range
        timeline.add({
          targets: itemEl,
          opacity: 0,
          duration: immediate ? 0 : 300,
          easing: 'easeOutQuad',
        }, 0);
        return;
      }

      const config = getPositionConfig(offset);
      
      timeline.add({
        targets: itemEl,
        translateX: config.translateX,
        translateZ: config.translateZ,
        rotateY: config.rotateY,
        scale: config.scale,
        opacity: config.opacity,
        zIndex: config.zIndex,
        filter: config.filter,
        duration,
        easing,
      }, 0);
    });

    animationRef.current = timeline;
    setCenteredIndex(targetIndex);
    if (onIndexChange) onIndexChange(targetIndex);
  }, [designs, isAnimating, onIndexChange]);

  // Handle wheel scroll
  const handleWheel = useCallback((e) => {
    if (!isHovering) return;
    e.preventDefault();
    e.stopPropagation();

    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(designs.length - 1, centeredIndex + direction));
    animateToIndex(newIndex);
  }, [isHovering, designs.length, centeredIndex, animateToIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isHovering) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = Math.min(designs.length - 1, centeredIndex + 1);
        animateToIndex(newIndex);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = Math.max(0, centeredIndex - 1);
        animateToIndex(newIndex);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (designs[centeredIndex]) {
          onDesignClick(designs[centeredIndex], centeredIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovering, designs, centeredIndex, animateToIndex, onDesignClick]);

  // Sync with external selectedIndex
  useEffect(() => {
    if (selectedIndex !== centeredIndex && !isAnimating) {
      animateToIndex(selectedIndex, true);
    }
  }, [selectedIndex, centeredIndex, isAnimating, animateToIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        anime.remove(animationRef.current);
      }
    };
  }, []);

  // Initial animation on mount
  useEffect(() => {
    animateToIndex(selectedIndex, true);
  }, []);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    const newIndex = Math.max(0, centeredIndex - 1);
    animateToIndex(newIndex);
  }, [centeredIndex, animateToIndex]);

  const goToNext = useCallback(() => {
    const newIndex = Math.min(designs.length - 1, centeredIndex + 1);
    animateToIndex(newIndex);
  }, [centeredIndex, designs.length, animateToIndex]);

  const goToIndex = useCallback((index) => {
    animateToIndex(index);
  }, [animateToIndex]);

  const goToFirst = useCallback(() => {
    animateToIndex(0);
  }, [animateToIndex]);

  // Render items with absolute positioning
  const renderItems = useMemo(() => {
    return designs.map((design, index) => {
      const offset = index - centeredIndex;
      const isCentered = index === centeredIndex;
      const isVisible = Math.abs(offset) <= 3;
      const config = getPositionConfig(offset);

      return (
        <div
          key={design.id}
          ref={(el) => { itemsRef.current[index] = el; }}
          className="coverflow-item"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transformOrigin: 'center center',
            transform: `
              translate(-50%, -50%)
              translateX(${config.translateX}px)
              translateZ(${config.translateZ}px)
              rotateY(${config.rotateY}deg)
              scale(${config.scale})
            `,
            opacity: config.opacity,
            zIndex: config.zIndex,
            filter: config.filter,
            pointerEvents: isCentered ? 'auto' : 'auto', // Allow clicks on all items
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
            willChange: 'transform, opacity, filter',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
          }}
          aria-hidden={!isCentered}
        >
          <DesignTile
            design={design}
            index={index}
            isActive={isCentered}
            isFocused={isCentered}
            isAdjacent={Math.abs(offset) === 1}
            onClick={isCentered 
              ? () => onDesignClick(design, index) 
              : () => animateToIndex(index)
            }
            layoutId={`gallery-${design.id}`}
          />
        </div>
      );
    });
  }, [designs, centeredIndex, animateToIndex, onDesignClick]);

  return (
    <div
      ref={containerRef}
      className="gallery-viewport"
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        touchAction: 'pan-y',
        perspective: PERSPECTIVE,
        perspectiveOrigin: 'center center',
      }}
    >
      {/* Cover flow container - centered with 3D perspective */}
      <div
        className="coverflow"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
        }}
        role="listbox"
        aria-label="Design template gallery"
      >
        {renderItems}
      </div>

      {/* Bottom Navigation - arrows positioned left/right of center, dots in center */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-30">
        <div className="flex items-center justify-between px-8 pb-4">
          {/* LEFT BUTTON - Go to first */}
          <button
            onClick={goToFirst}
            aria-label="Go to first design"
            disabled={centeredIndex === 0}
            style={{ 
              opacity: centeredIndex === 0 ? 0.4 : 1, 
              pointerEvents: centeredIndex === 0 ? 'none' : 'auto' 
            }}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {/* LEFT BUTTON - Previous (moves tiles right, shows previous item) */}
          <button
            onClick={goToPrevious}
            aria-label="Previous design"
            disabled={centeredIndex === 0}
            style={{ 
              opacity: centeredIndex === 0 ? 0.4 : 1, 
              pointerEvents: centeredIndex === 0 ? 'none' : 'auto' 
            }}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots indicator - centered */}
          <div className="nav-dots pointer-events-auto flex items-center gap-2">
            {designs.map((_, index) => {
              const isActive = index === centeredIndex;
              return (
                <motion.button
                  key={index}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to ${designs[index].title}`}
                  aria-current={isActive ? 'true' : 'false'}
                  style={{ 
                    backgroundColor: isActive ? '#3b82f6' : '#d1d5db',
                    transform: `scale(${isActive ? 1.5 : 1})`,
                  }}
                  whileHover={{ scale: isActive ? 1.7 : 1.2 }}
                  whileTap={{ scale: isActive ? 1.4 : 0.9 }}
                />
              );
            })}
          </div>

          {/* RIGHT BUTTON - Next (moves tiles left, shows next item) */}
          <button
            onClick={goToNext}
            aria-label="Next design"
            disabled={centeredIndex === designs.length - 1}
            style={{ 
              opacity: centeredIndex === designs.length - 1 ? 0.4 : 1, 
              pointerEvents: centeredIndex === designs.length - 1 ? 'none' : 'auto' 
            }}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* RIGHT BUTTON - Go to last */}
          <button
            onClick={() => goToIndex(designs.length - 1)}
            aria-label="Go to last design"
            disabled={centeredIndex === designs.length - 1}
            style={{ 
              opacity: centeredIndex === designs.length - 1 ? 0.4 : 1, 
              pointerEvents: centeredIndex === designs.length - 1 ? 'none' : 'auto' 
            }}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}