import { useState, useEffect, useRef, useCallback } from 'react';

export function useCoverFlow({ 
  cards, 
  isPopupOpen,
  initialIndex = 0,
  autoPlayInterval = 3000,
  scrollThrottleMs = 450
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  
  const lastScrollTime = useRef(0);
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);
  const visibleCountRef = useRef(3);

  const updateVisibleCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width < 640) visibleCountRef.current = 1;
    else if (width < 1024) visibleCountRef.current = 2;
    else if (width < 1440) visibleCountRef.current = 3;
    else visibleCountRef.current = 4;
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [updateVisibleCount]);

  const isPaused = isHovered || isTouching || isPopupOpen;

  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (isPaused || cards.length <= 1) return;
    clearAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = prev + 1;
        if (next >= cards.length) return 0;
        return next;
      });
    }, autoPlayInterval);
  }, [isPaused, cards.length, autoPlayInterval, clearAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return clearAutoPlay;
  }, [startAutoPlay, clearAutoPlay]);

  const goToIndex = useCallback((index) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    setActiveIndex(clamped);
  }, [cards.length]);

  const goToPrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const goToNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const handleWheel = useCallback((e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < scrollThrottleMs) {
      e.preventDefault();
      return;
    }
    lastScrollTime.current = now;

    if (!isHovered) return;
    
    e.preventDefault();
    e.stopPropagation();

    const direction = e.deltaY > 0 ? 1 : -1;
    goToIndex(activeIndex + direction);
  }, [isHovered, activeIndex, goToIndex, scrollThrottleMs]);

  const handleKeyDown = useCallback((e) => {
    if (!isHovered) return;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goToPrev();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        break;
      case 'Home':
        e.preventDefault();
        goToIndex(0);
        break;
      case 'End':
        e.preventDefault();
        goToIndex(cards.length - 1);
        break;
    }
  }, [isHovered, goToNext, goToPrev, goToIndex, cards.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = useCallback((e) => {
    if (!isHovered) return;
    setTouchStartX(e.touches[0].clientX);
    setIsTouching(true);
  }, [isHovered]);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX === 0) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    
    if (Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? 1 : -1;
      goToIndex(activeIndex + direction);
    }
    
    setTouchStartX(0);
    setIsTouching(false);
  }, [activeIndex, goToIndex, touchStartX]);

  const attachWheelListener = useCallback((el) => {
    if (!el) return;
    containerRef.current = el;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel, { passive: false });
  }, [handleWheel]);

  const getCardTransform = useCallback((index) => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);
    const visibleCount = visibleCountRef.current;

    if (absOffset > visibleCount) {
      return { 
        transform: 'translateX(-9999px)', 
        opacity: 0, 
        zIndex: 1,
        isVisible: false 
      };
    }

    if (offset === 0) {
      return {
        transform: 'translateZ(200px) rotateY(0deg)',
        opacity: 1,
        zIndex: 100,
        isVisible: true,
        isCenter: true
      };
    }

    const direction = offset > 0 ? 1 : -1;
    const baseSpacing = 180;
    const baseDepth = -150;
    const baseRotate = 45;

    const x = direction * (baseSpacing * absOffset);
    const z = baseDepth * (absOffset - 1) - 50;
    const rotateY = direction * baseRotate * (absOffset === 1 ? 1 : 0.7);

    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`,
      opacity: 0.7,
      zIndex: 50 - absOffset,
      isVisible: true,
      isCenter: false,
      isAdjacent: absOffset === 1
    };
  }, [activeIndex]);

  return {
    activeIndex,
    setActiveIndex: goToIndex,
    goToPrev,
    goToNext,
    isHovered,
    setIsHovered,
    isTouching,
    attachWheelListener,
    handleTouchStart,
    handleTouchEnd,
    getCardTransform,
    visibleCount: visibleCountRef.current,
    containerRef
  };
}