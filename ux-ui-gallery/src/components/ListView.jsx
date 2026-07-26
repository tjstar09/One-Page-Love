import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { searchPexelsImage } from '../utils/pexels';

function ListCard({ design, isFavorite, onClick, onFavoriteToggle }) {
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

  const cardBg = design.colors?.background || '#FFFFFF';
  const cardBorder = design.colors?.primary || '#3B82F6';

  return (
    <motion.article
      layout
      className="list-card group relative overflow-hidden rounded-2xl transition-all duration-300"
      style={{ backgroundColor: cardBg, borderColor: cardBorder }}
      onClick={onClick}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        scale: 1.01,
      }}
      whileTap={{ scale: 0.99 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }}}
      aria-label={`View ${design.title} design template`}
    >
      <div className="relative h-48 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {image && !imageLoading && !imageError && (
          <motion.img
            src={image.url}
            alt={image.alt || design.title}
            className="w-full h-full object-cover transition-transform duration-500"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          />
        )}

        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
        
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-md">
            {design.skill}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-md">
            {design.category.split(' ')[0]}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex gap-2" aria-label="Interactive elements">
            {design.interactiveElements?.slice(0, 4).map((element, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-white/90 backdrop-blur-sm text-gray-700 rounded shadow-sm">
                {element}
              </span>
            ))}
            {design.interactiveElements && design.interactiveElements.length > 4 && (
              <span className="px-2 py-1 text-xs bg-white/90 backdrop-blur-sm text-gray-500 rounded shadow-sm">
                +{design.interactiveElements.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onFavoriteToggle && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onFavoriteToggle(design.id); }}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'text-pink-500 bg-white/90' 
                    : 'text-gray-400 bg-white/90 hover:bg-white hover:text-pink-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isFavorite ? `Remove ${design.title} from favorites` : `Add ${design.title} to favorites`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            )}

            <motion.button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="p-2 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 shadow-md transition-colors"
              aria-label={`Open ${design.title}`}
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

      <div className="p-5 h-32 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{design.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{design.description}</p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex gap-1.5">
            {design.colors && Object.entries(design.colors).slice(0, 4).map(([name, color]) => (
              <div
                key={name}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                title={name}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ListView({ 
  designs = [], 
  onDesignClick, 
  onFavoriteToggle,
  favoriteIds = []
}) {
  const handleCardClick = useCallback((design) => {
    onDesignClick?.(design);
  }, [onDesignClick]);

  const handleFavoriteToggle = useCallback((designId) => {
    onFavoriteToggle?.(designId);
  }, [onFavoriteToggle]);

  if (!designs.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No templates to display</p>
      </div>
    );
  }

  return (
    <div className="list-view" role="list" aria-label="Design templates list">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {designs.map((design) => (
          <ListCard
            key={design.id}
            design={design}
            isFavorite={favoriteIds.includes(design.id)}
            onClick={() => handleCardClick(design)}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
}