/**
 * Alternative Image Sources for Psalms
 * Using multiple free APIs and fallbacks
 */

const fs = require('fs');
const path = require('path');

// Multiple API sources as fallbacks
const IMAGE_SOURCES = {
  // Pixabay (free, requires API key but generous limits)
  pixabay: {
    baseUrl: 'https://pixabay.com/api/',
    key: 'YOUR_PIXABAY_KEY', // Get from https://pixabay.com/api/docs/
    params: 'image_type=photo&orientation=horizontal&category=nature&min_width=1920&safesearch=true'
  },
  
  // Lorem Picsum (no API key needed)
  picsum: {
    baseUrl: 'https://picsum.photos/1920/1080',
    // Returns random nature-ish photos
  }
};

// Curated nature image collection (fallback)
const FALLBACK_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    description: 'Mountain landscape',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com'
  },
  // Add more curated URLs...
];

async function fetchFromPixabay(query) {
  if (IMAGE_SOURCES.pixabay.key === 'YOUR_PIXABAY_KEY') {
    return null;
  }
  
  try {
    const url = `${IMAGE_SOURCES.pixabay.baseUrl}?key=${IMAGE_SOURCES.pixabay.key}&q=${encodeURIComponent(query)}&${IMAGE_SOURCES.pixabay.params}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        const image = data.hits[0];
        return {
          id: image.id,
          url: image.largeImageURL,
          urlSmall: image.webformatURL,
          urlFull: image.fullHDURL || image.largeImageURL,
          description: image.tags,
          photographer: image.user,
          photographerUrl: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
          source: 'Pixabay'
        };
      }
    }
  } catch (error) {
    console.error('Pixabay error:', error);
  }
  
  return null;
}

async function getFallbackImage(psalmNumber) {
  // Use a curated fallback image
  const imageIndex = psalmNumber % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[imageIndex];
}

// Nature themes for different psalm types
const psalmImageThemes = {
  1: 'tree by river',
  2: 'mountain sunrise',
  3: 'protective forest',
  4: 'calm lake',
  5: 'morning light',
  6: 'healing garden',
  7: 'safe harbor',
  8: 'starry night',
  9: 'wildflower meadow',
  10: 'storm clearing',
  23: 'green pastures',
  27: 'lighthouse',
  46: 'mountain refuge',
  51: 'clean spring',
  91: 'eagle flying',
  96: 'ocean waves',
  100: 'blooming garden',
  103: 'endless sky',
  121: 'hills at dawn',
  133: 'peaceful landscape',
  139: 'intricate nature',
  148: 'celestial sky',
  150: 'vibrant nature'
};

async function generatePsalmImagesAlternative() {
  console.log('🖼️ Generating psalm images using alternative sources...');
  
  const psalmImages = {};
  
  for (let psalmNumber = 1; psalmNumber <= 150; psalmNumber++) {
    console.log(`Processing Psalm ${psalmNumber}...`);
    
    const theme = psalmImageThemes[psalmNumber] || 'peaceful nature';
    let imageData = null;
    
    // Try Pixabay first
    imageData = await fetchFromPixabay(theme);
    
    // Fallback to curated image
    if (!imageData) {
      imageData = await getFallbackImage(psalmNumber);
    }
    
    if (imageData) {
      psalmImages[psalmNumber] = {
        ...imageData,
        psalmTheme: theme
      };
      console.log(`✓ Image found for Psalm ${psalmNumber}`);
    }
    
    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Save the results
  const outputPath = path.join(__dirname, '../data/psalmImages.ts');
  const output = `// Psalm Images from Alternative Sources
// Generated on ${new Date().toISOString()}

export interface PsalmImage {
  id: string | number;
  url: string;
  urlSmall: string;
  urlFull: string;
  description: string;
  photographer: string;
  photographerUrl: string;
  source: string;
  psalmTheme: string;
}

export const psalmImages: Record<number, PsalmImage> = ${JSON.stringify(psalmImages, null, 2)};

export function getPsalmImage(psalmNumber: number): PsalmImage | undefined {
  return psalmImages[psalmNumber];
}

export function getAttributionText(image: PsalmImage): string {
  return \`Photo by \${image.photographer} on \${image.source}\`;
}
`;

  fs.writeFileSync(outputPath, output, 'utf8');
  
  console.log(`\n✅ Generated ${Object.keys(psalmImages).length} psalm images!`);
  console.log(`💾 Saved to: ${outputPath}`);
}

if (require.main === module) {
  generatePsalmImagesAlternative().catch(console.error);
}

module.exports = { generatePsalmImagesAlternative };
