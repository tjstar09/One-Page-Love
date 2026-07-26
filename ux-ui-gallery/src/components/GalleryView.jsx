import { useState, useCallback } from 'react';
import CoverFlowGallery from './CoverFlowGallery';
import ListView from './ListView';

export default function GalleryView({ 
  designs = [], 
  onDesignClick, 
  selectedIndex = 0,
  selectedDesign = null,
  onFavoriteToggle,
  favoriteIds = []
}) {
  const [viewMode, setViewMode] = useState('coverflow');
  const isPopupOpen = !!selectedDesign;

  const handleCardClick = useCallback((card) => {
    onDesignClick?.(card, selectedIndex);
  }, [onDesignClick, selectedIndex]);

  return (
    <div className="gallery-view">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}>
          Browse Templates
        </h2>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('coverflow')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'coverflow'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-pressed={viewMode === 'coverflow'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline ml-1">Cover Flow</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-pressed={viewMode === 'list'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline ml-1">List</span>
          </button>
        </div>
      </div>

      {viewMode === 'coverflow' ? (
        <CoverFlowGallery
          cards={designs}
          onCardClick={handleCardClick}
          isPopupOpen={isPopupOpen}
          initialIndex={selectedIndex}
        />
      ) : (
        <ListView
          designs={designs}
          onDesignClick={onDesignClick}
          onFavoriteToggle={onFavoriteToggle}
          favoriteIds={favoriteIds}
        />
      )}
    </div>
  );
}