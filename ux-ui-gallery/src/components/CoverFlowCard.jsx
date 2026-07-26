import { useState, useEffect, useCallback, useMemo } from 'react';
import { searchPexelsImage } from '../utils/pexels';

// Get total count from the design templates data
import { designTemplates } from '../data/designTemplates';

export default function CoverFlowCard({ 
  design, 
  index, 
  isCenter, 
  isAdjacent, 
  isVisible,
  onClick,
  style 
}) {
  const totalCount = useMemo(() => designTemplates?.length || 0, []);
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const loadImage = useCallback(() => {
    let mounted = true;
    setImageLoading(true);
    setImageError(false);
    
    searchPexelsImage(design.pexelsQuery)
      .then(photo => {
        if (mounted) {
          setImage(photo);
          setImageLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setImageError(true);
          setImageLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [design.pexelsQuery]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const cardClassName = [
    'coverflow-card',
    isCenter && 'coverflow-card-center',
    !isCenter && 'coverflow-card-side',
    !isVisible && 'coverflow-card-hidden'
  ].filter(Boolean).join(' ');

  const innerClassName = [
    'coverflow-card-inner',
    isCenter && 'coverflow-card-inner-center',
    !isCenter && 'coverflow-card-inner-side'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClassName}
      style={style}
      role="option"
      aria-selected={isCenter}
      aria-label={`${design.title} - ${design.skill} design${isCenter ? ' (currently focused, press Enter to open)' : ' (click to focus)'}`}
      aria-posinset={index + 1}
      aria-setsize={totalCount}
      tabIndex={isCenter ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isCenter) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={innerClassName}>
        <div className="coverflow-card-image-wrapper">
          {imageLoading && (
            <div className="coverflow-card-loading" aria-hidden="true">
              <svg className="coverflow-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle className="coverflow-spinner-circle" cx="12" cy="12" r="10" strokeLinecap="round" />
              </svg>
              <span className="sr-only">Loading image for {design.title}</span>
            </div>
          )}

          {image && !imageLoading && !imageError && (
            <img
              src={image.url}
              alt={image.alt || `${design.title} design preview`}
              className="coverflow-card-image"
              loading="lazy"
            />
          )}

          {imageError && (
            <div className="coverflow-card-error" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="sr-only">Image failed to load for {design.title}</span>
            </div>
          )}

          <div className="coverflow-card-overlay" aria-hidden="true" />
        </div>

        <div className="coverflow-card-content">
          <h3 className="coverflow-card-title">{design.title}</h3>
          <div className="coverflow-card-meta">
            <span className={`coverflow-badge coverflow-badge-skill`} 
                  style={{ 
                    '--skill-bg': `${design.colors.primary}1a`,
                    '--skill-color': design.colors.primary,
                    '--skill-border': `${design.colors.primary}33`
                  }}>
              {design.skill}
            </span>
            <span className="coverflow-badge coverflow-badge-category">
              {design.category.split(' ')[0]}
            </span>
          </div>
        </div>

        {isCenter && (
          <div className="coverflow-center-indicator" aria-hidden="true">
            FOCUS
          </div>
        )}
      </div>
    </div>
  );
}