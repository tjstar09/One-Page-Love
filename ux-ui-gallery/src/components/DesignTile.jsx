import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { searchPexelsImage } from '../utils/pexels';

export default function DesignTile({ design, index, isActive, isCentered, onClick, layoutId, onFavoriteToggle, isFavorited }) {
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
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

  // Determine tile background color from design
  const tileStyle = {
    backgroundColor: design.colors.background,
    borderColor: design.colors.primary,
  };

  // Visual state based on focus
  const isFocused = isCentered;

  return (
    <motion.article
      layoutId={layoutId ? `${layoutId}-${design.id}` : undefined}
      className="relative flex-shrink-0 w-[280px] h-[380px] md:w-[320px] md:h-[420px] rounded-2xl overflow-hidden transition-all duration-300"
      style={tileStyle}
      onClick={onClick}
      whileHover={isFocused ? { 
        y: -8, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        scale: 1.02,
      } : { 
        y: -4, 
        boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.12)',
        scale: 1.01,
      }}
      whileTap={isFocused ? { scale: 0.98 } : { scale: 0.99 }}
      animate={{ 
        boxShadow: isActive ? '0 25px 50px -12px rgba(0, 0, 0, 0.2)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        zIndex: isActive ? 10 : 1,
        opacity: isFocused ? 1 : 0.6,
        filter: isFocused ? 'none' : 'grayscale(0.4) brightness(0.85)',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }}}
      aria-label={isFocused ? `View ${design.title} design template` : `${design.title} design template (click to focus)`}
      aria-disabled={false}
    >
      {/* Image */}
      <div className="relative w-full h-3/4 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {image && !imageLoading && !imageError && (
          <motion.img
            src={image.url}
            alt={image.alt || design.title}
            className="w-full h-full object-cover transition-transform duration-500"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          />
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
        
        {/* Skill badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-md">
            {design.skill}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-md">
            {design.category.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 h-1/4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
            {design.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {design.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex gap-1.5" aria-label="Interactive elements">
            {design.interactiveElements.slice(0, 3).map((element, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                {element}
              </span>
            ))}
            {design.interactiveElements.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">
                +{design.interactiveElements.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Favorite Button */}
            {onFavoriteToggle && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onFavoriteToggle(design.id); }}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited 
                    ? 'text-pink-500 bg-pink-50' 
                    : 'text-gray-400 bg-white/80 hover:bg-white hover:text-pink-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isFavorited ? `Remove ${design.title} from favorites` : `Add ${design.title} to favorites`}
              >
                <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            )}

            {/* Maximize button */}
            <motion.button
              className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 shadow-md transition-colors"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              aria-label={`Maximize ${design.title}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}