/**
 * Unsplash Image Generator for Psalms
 * Fetches beautiful nature and calming images for each psalm
 */

const fs = require('fs');
const path = require('path');

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = 'hVg9cilZ7J1F_xX7q4xUu19BIsl4_btLPPoxJhuzqL4'; // Your Unsplash access key
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

// Nature and calming keywords for different psalm themes
const psalmImageKeywords = {
  // Trust & Peace themes
  1: 'peaceful river, flowing water',
  2: 'majestic mountain, sunrise',
  3: 'protective forest, tall trees',
  4: 'calm lake, reflection',
  5: 'morning light, gentle sunrise',
  6: 'healing garden, green plants',
  7: 'safe harbor, peaceful bay',
  8: 'starry night, cosmos',
  9: 'celebration meadow, wildflowers',
  10: 'storm clouds clearing, hope',
  
  // Praise & Worship themes
  23: 'green pastures, sheep meadow',
  27: 'lighthouse, guiding light',
  46: 'mountain refuge, fortress',
  51: 'clean spring, crystal water',
  91: 'eagle soaring, wings',
  96: 'ocean waves, vast sea',
  100: 'joyful garden, blooming flowers',
  103: 'endless sky, clouds',
  117: 'diverse landscape, unity',
  121: 'hills at dawn, horizon',
  133: 'peaceful community, harmony',
  139: 'intricate nature, detailed creation',
  148: 'heavenly sky, celestial',
  150: 'vibrant celebration, colorful nature',
  
  // Default nature themes for other psalms
  default: [
    'serene landscape',
    'peaceful nature',
    'calm forest',
    'gentle stream',
    'mountain vista',
    'sunset sky',
    'flowering meadow',
    'tranquil lake',
    'misty morning',
    'golden hour nature'
  ]
};

async function fetchImageFromUnsplash(query, psalmNumber) {
  try {
    const searchQuery = encodeURIComponent(query);
    const url = `${UNSPLASH_API_BASE}/search/photos?query=${searchQuery}&orientation=landscape&per_page=5&order_by=relevant`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const image = data.results[0]; // Get the best match
      
      return {
        id: image.id,
        // PRODUCTION REQUIREMENT: Use original Unsplash URLs (hotlinking)
        url: image.urls.regular, // Main display URL - MUST hotlink to Unsplash
        urlSmall: image.urls.small, // Thumbnail URL - MUST hotlink to Unsplash
        urlFull: image.urls.full, // High resolution URL - MUST hotlink to Unsplash
        description: image.alt_description || image.description || `Nature scene for Psalm ${psalmNumber}`,
        // PRODUCTION REQUIREMENT: Photographer attribution
        photographer: image.user.name,
        photographerUrl: image.user.links.html, // Link to photographer's Unsplash profile
        unsplashUrl: image.links.html, // Link to photo on Unsplash
        // PRODUCTION REQUIREMENT: Download endpoint for usage tracking
        downloadUrl: image.links.download_location, // MUST trigger this when image is used
        color: image.color,
        width: image.width,
        height: image.height,
        // Additional Unsplash data
        likes: image.likes,
        createdAt: image.created_at
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching image for Psalm ${psalmNumber}:`, error);
    return null;
  }
}

// PRODUCTION REQUIREMENT: Function to trigger download tracking
async function triggerDownload(downloadUrl) {
  try {
    const response = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✓ Download tracked successfully');
    }
  } catch (error) {
    console.error('Error tracking download:', error);
  }
}

async function generatePsalmImages() {
  console.log('🖼️ Generating psalm images from Unsplash...');
  
  if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
    console.log('❌ Please set your Unsplash API key first!');
    console.log('📝 Get one free at: https://unsplash.com/developers');
    return;
  }
  
  const psalmImages = {};
  
  for (let psalmNumber = 1; psalmNumber <= 150; psalmNumber++) {
    console.log(`Fetching image for Psalm ${psalmNumber}...`);
    
    // Get keyword for this psalm or use default
    let query = psalmImageKeywords[psalmNumber];
    if (!query) {
      const defaultKeywords = psalmImageKeywords.default;
      query = defaultKeywords[psalmNumber % defaultKeywords.length];
    }
    
    const imageData = await fetchImageFromUnsplash(query, psalmNumber);
    
    if (imageData) {
      psalmImages[psalmNumber] = imageData;
      console.log(`✓ Found image for Psalm ${psalmNumber}: ${imageData.description}`);
    } else {
      console.log(`⚠ No image found for Psalm ${psalmNumber}`);
    }
    
    // Rate limiting - be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Save the image data
  const outputPath = path.join(__dirname, '../data/psalmImages.ts');
  const output = `// Psalm Images from Unsplash
// Generated on ${new Date().toISOString()}
// PRODUCTION COMPLIANT: Follows all Unsplash API guidelines

export interface PsalmImage {
  id: string;
  url: string; // MUST hotlink to original Unsplash URL
  urlSmall: string; // MUST hotlink to original Unsplash URL  
  urlFull: string; // MUST hotlink to original Unsplash URL
  description: string;
  photographer: string; // REQUIRED for attribution
  photographerUrl: string; // REQUIRED: Link to photographer's Unsplash profile
  unsplashUrl: string; // REQUIRED: Link to photo on Unsplash
  downloadUrl: string; // REQUIRED: Must trigger when image is used
  color: string;
  width: number;
  height: number;
  likes: number;
  createdAt: string;
}

export const psalmImages: Record<number, PsalmImage> = ${JSON.stringify(psalmImages, null, 2)};

// Helper function to get image for a psalm
export function getPsalmImage(psalmNumber: number): PsalmImage | undefined {
  return psalmImages[psalmNumber];
}

// PRODUCTION REQUIREMENT: Generate proper attribution text
export function getAttributionText(image: PsalmImage): string {
  return \`Photo by \${image.photographer} on Unsplash\`;
}

// PRODUCTION REQUIREMENT: Generate attribution HTML with links
export function getAttributionHTML(image: PsalmImage): string {
  return \`Photo by <a href="\${image.photographerUrl}">\${image.photographer}</a> on <a href="\${image.unsplashUrl}">Unsplash</a>\`;
}

// PRODUCTION REQUIREMENT: Function to call when image is actually used
export async function trackImageUsage(image: PsalmImage): Promise<void> {
  try {
    await fetch(image.downloadUrl, {
      headers: {
        'Authorization': 'Client-ID hVg9cilZ7J1F_xX7q4xUu19BIs14_btLPPoxJhuzqL4'
      }
    });
  } catch (error) {
    console.error('Error tracking image usage:', error);
  }
}
`;

  fs.writeFileSync(outputPath, output, 'utf8');
  
  console.log(`\n✅ Generated psalm images!`);
  console.log(`🖼️ Total images: ${Object.keys(psalmImages).length}`);
  console.log(`💾 Saved to: ${outputPath}`);
  
  console.log(`\n📋 PRODUCTION USAGE REQUIREMENTS:`);
  console.log(`✓ Images MUST be hotlinked (using original Unsplash URLs)`);
  console.log(`✓ Downloads MUST be tracked when images are used`);
  console.log(`✓ Photographer and Unsplash MUST be attributed`);
  console.log(`✓ App name cannot include 'Unsplash'`);
  
  console.log(`\n💻 Usage in your components:`);
  console.log(`import { getPsalmImage, getAttributionHTML, trackImageUsage } from '@/data/psalmImages';`);
  console.log(`const image = getPsalmImage(23);`);
  console.log(`const attribution = getAttributionHTML(image);`);
  console.log(`await trackImageUsage(image); // Call when image is displayed`);
}

if (require.main === module) {
  generatePsalmImages().catch(console.error);
}

module.exports = { generatePsalmImages, fetchImageFromUnsplash, triggerDownload };
