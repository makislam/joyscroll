/**
 * Pexels Image Generator for Psalms
 * Alternative to Unsplash with different style of nature photography
 */

const fs = require('fs');
const path = require('path');

// Pexels API configuration
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // Get from https://www.pexels.com/api/
const PEXELS_API_BASE = 'https://api.pexels.com/v1';

async function fetchImageFromPexels(query, psalmNumber) {
  try {
    const searchQuery = encodeURIComponent(query);
    const url = `${PEXELS_API_BASE}/search?query=${searchQuery}&orientation=landscape&per_page=5`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      
      return {
        id: photo.id,
        url: photo.src.large, // Good quality for web
        urlSmall: photo.src.medium, // For thumbnails
        urlFull: photo.src.original, // High resolution
        description: photo.alt || `Nature scene for Psalm ${psalmNumber}`,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        width: photo.width,
        height: photo.height,
        avgColor: photo.avg_color
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Pexels image for Psalm ${psalmNumber}:`, error);
    return null;
  }
}

module.exports = { fetchImageFromPexels };
