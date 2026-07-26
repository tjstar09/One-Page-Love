export default function CoverFlowNavigation({ 
  cards = [], 
  activeIndex = 0, 
  onPrev, 
  onNext, 
  onDotClick,
  disabled = false 
}) {
  if (cards.length <= 1) return null;

  return (
    <nav 
      className="coverflow-navigation" 
      aria-label="Carousel navigation"
      style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.5 : 1 }}
    >
      <button
        type="button"
        className="coverflow-nav-btn"
        onClick={onPrev}
        disabled={activeIndex === 0 || disabled}
        aria-label="Previous design"
        aria-disabled={activeIndex === 0 || disabled}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="coverflow-dots" role="tablist" aria-label="Design templates">
        {cards.map((card, index) => (
          <button
            key={card.id}
            type="button"
            className={`coverflow-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => onDotClick(index)}
            disabled={disabled}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to ${card.title}`}
            aria-controls={`coverflow-panel-${index}`}
            id={`coverflow-tab-${index}`}
          />
        ))}
      </div>

      <button
        type="button"
        className="coverflow-nav-btn"
        onClick={onNext}
        disabled={activeIndex === cards.length - 1 || disabled}
        aria-label="Next design"
        aria-disabled={activeIndex === cards.length - 1 || disabled}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}