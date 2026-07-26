import { useEffect, useRef } from 'react';
import { useCoverFlow } from '../hooks/useCoverFlow';
import CoverFlowCard from './CoverFlowCard';
import CoverFlowNavigation from './CoverFlowNavigation';
import '../styles/CoverFlow.css';

export default function CoverFlowGallery({ 
  cards = [], 
  onCardClick, 
  isPopupOpen = false,
  initialIndex = 0
}) {
  const {
    activeIndex,
    setActiveIndex,
    goToPrev,
    goToNext,
    setIsHovered,
    attachWheelListener,
    handleTouchStart,
    handleTouchEnd,
    getCardTransform,
    containerRef
  } = useCoverFlow({
    cards,
    isPopupOpen,
    initialIndex
  });

  const announcerRef = useRef(null);

  // Announce active index changes to screen readers
  useEffect(() => {
    if (cards.length > 0 && window.__a11yAnnounce) {
      const card = cards[activeIndex];
      if (card) {
        window.__a11yAnnounce(`Showing design ${activeIndex + 1} of ${cards.length}: ${card.title}`);
      }
    }
  }, [activeIndex, cards]);

  const handleCardInteraction = (index, card) => {
    if (index === activeIndex) {
      onCardClick?.(card);
    } else {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, setActiveIndex]);

  if (!cards.length) {
    return (
      <div className="coverflow-container" role="region" aria-label="No designs available">
        <div className="coverflow-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px', color: '#9ca3af' }}>
          <p>No designs to display</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="coverflow-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Design template gallery"
      aria-roledescription="carousel"
    >
      {/* Screen reader live region for current slide */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div 
        className="coverflow-track" 
        ref={attachWheelListener}
        role="listbox"
        aria-label="Design templates"
      >
        {cards.map((card, index) => {
          const { transform, opacity, zIndex, isVisible, isCenter, isAdjacent } = getCardTransform(index);
          
          return (
            <CoverFlowCard
              key={card.id}
              design={card}
              index={index}
              isCenter={isCenter}
              isAdjacent={isAdjacent}
              isVisible={isVisible}
              style={{ transform, opacity, zIndex }}
              onClick={() => handleCardInteraction(index, card)}
            />
          );
        })}
      </div>

      <CoverFlowNavigation
        cards={cards}
        activeIndex={activeIndex}
        onPrev={goToPrev}
        onNext={goToNext}
        onDotClick={setActiveIndex}
        disabled={isPopupOpen}
      />
    </div>
  );
}
