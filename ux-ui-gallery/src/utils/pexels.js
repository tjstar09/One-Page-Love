const PEXELS_API_KEY = 'rHvugXMBA0hbhzJhBEEwGGpbEYtW7hOTbrxHyPTHK4fPtwW9Yf1S1ZoZ';
const PEXELS_API_BASE = 'https://api.pexels.com/v1';
const CACHE_KEY = 'pexels_cache_v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache for the current session
const memoryCache = new Map();

// Load persisted cache from localStorage
function loadCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        Object.entries(data).forEach(([key, value]) => {
          memoryCache.set(key, value);
        });
        return data;
      }
    }
  } catch (e) {
    console.warn('Failed to load Pexels cache:', e);
  }
  return {};
}

// Save cache to localStorage
function saveCache() {
  try {
    const data = Object.fromEntries(memoryCache);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Failed to save Pexels cache:', e);
  }
}

// Initialize cache on load
loadCache();

async function fetchFromPexels(query, perPage = 1) {
  const cacheKey = `search:${query}:${perPage}`;
  
  // Check memory cache first
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const response = await fetch(`${PEXELS_API_BASE}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Pexels API rate limit reached, using fallback');
        return getFallbackImage(query);
      }
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    
    const result = {
      photos: data.photos.map(photo => ({
        id: photo.id,
        url: photo.src.large2x || photo.src.large || photo.src.medium,
        thumbnail: photo.src.medium,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        alt: photo.alt,
      })),
      query,
      timestamp: Date.now(),
    };

    // Cache the result
    memoryCache.set(cacheKey, result);
    saveCache();

    return result;
  } catch (error) {
    console.error('Pexels API error:', error);
    return getFallbackImage(query);
  }
}

function getFallbackImage(query) {
  // Generate a deterministic fallback image URL based on the query
  const colors = [
    '4A90D9', '50C878', 'FFA07A', 'DDA0DD', 'F0E68C',
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7'
  ];
  const colorIndex = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const color = colors[colorIndex];
  
  return {
    photos: [{
      id: `fallback-${query}`,
      url: `https://via.placeholder.com/1200x800/${color}/FFFFFF?text=${encodeURIComponent(query)}`,
      thumbnail: `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(query)}`,
      photographer: 'Placeholder',
      photographerUrl: '#',
      alt: `Placeholder for ${query}`,
    }],
    query,
    timestamp: Date.now(),
    isFallback: true,
  };
}

// Search for images by query, returns first photo
export async function searchPexelsImage(query, perPage = 1) {
  const result = await fetchFromPexels(query, perPage);
  return result.photos[0] || getFallbackImage(query).photos[0];
}

// Search for multiple images
export async function searchPexelsImages(query, perPage = 5) {
  const result = await fetchFromPexels(query, perPage);
  return result.photos;
}

// Get a specific photo by ID
export async function getPexelsPhoto(id) {
  const cacheKey = `photo:${id}`;
  
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const response = await fetch(`${PEXELS_API_BASE}/photos/${id}`, {
      headers: { 'Authorization': PEXELS_API_KEY },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch photo: ${response.status}`);
    
    const photo = await response.json();
    const result = {
      id: photo.id,
      url: photo.src.large2x || photo.src.large || photo.src.medium,
      thumbnail: photo.src.medium,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt,
    };
    
    memoryCache.set(cacheKey, result);
    saveCache();
    return result;
  } catch (error) {
    console.error('Failed to fetch Pexels photo:', error);
    return getFallbackImage(`photo-${id}`).photos[0];
  }
}

// Clear cache (for testing or manual refresh)
export function clearPexelsCache() {
  memoryCache.clear();
  localStorage.removeItem(CACHE_KEY);
}

// Get cache stats
export function getCacheStats() {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
}