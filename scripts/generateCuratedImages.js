/**
 * Curated Psalm Images Collection
 * High-quality nature images from free sources
 */

const fs = require('fs');
const path = require('path');

// Curated collection of beautiful nature images (all free to use)
const curatedPsalmImages = {
  1: {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&auto=format',
    description: 'Forest path through tall trees',
    photographer: 'Steve Halama',
    source: 'Unsplash',
    theme: 'growth, guidance'
  },
  2: {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
    description: 'Majestic mountain landscape',
    photographer: 'Qingbao Meng',
    source: 'Unsplash',
    theme: 'strength, majesty'
  },
  3: {
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&auto=format',
    description: 'Peaceful forest clearing',
    photographer: 'Casey Horner',
    source: 'Unsplash',
    theme: 'protection, refuge'
  },
  4: {
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&auto=format',
    description: 'Calm lake reflection',
    photographer: 'Claudio Testa',
    source: 'Unsplash',
    theme: 'peace, stillness'
  },
  5: {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&auto=format',
    description: 'Golden sunrise over hills',
    photographer: 'Sergey Pesterev',
    source: 'Unsplash',
    theme: 'new beginning, hope'
  },
  8: {
    url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop&auto=format',
    description: 'Starry night sky',
    photographer: 'Kristopher Roller',
    source: 'Unsplash',
    theme: 'majesty, creation'
  },
  19: {
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop&auto=format',
    description: 'Heavens declaring glory',
    photographer: 'Qingbao Meng',
    source: 'Unsplash',
    theme: 'creation, glory'
  },
  23: {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&auto=format',
    description: 'Green pastures with sheep',
    photographer: 'Illustration',
    source: 'Unsplash',
    theme: 'shepherd, provision'
  },
  27: {
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&auto=format',
    description: 'Light through forest',
    photographer: 'Casey Horner',
    source: 'Unsplash',
    theme: 'light, salvation'
  },
  46: {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
    description: 'Mountain fortress',
    photographer: 'Qingbao Meng',
    source: 'Unsplash',
    theme: 'refuge, strength'
  },
  51: {
    url: 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=1920&h=1080&fit=crop&auto=format',
    description: 'Clear flowing stream',
    photographer: 'Steven Kamenar',
    source: 'Unsplash',
    theme: 'cleansing, renewal'
  },
  91: {
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop&auto=format',
    description: 'Eagle soaring high',
    photographer: 'Richard Lee',
    source: 'Unsplash',
    theme: 'protection, wings'
  },
  96: {
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop&auto=format',
    description: 'Ocean waves at sunset',
    photographer: 'Jeremy Bishop',
    source: 'Unsplash',
    theme: 'new song, vastness'
  },
  100: {
    url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop&auto=format',
    description: 'Joyful flower field',
    photographer: 'Cosmic Timetraveler',
    source: 'Unsplash',
    theme: 'joy, celebration'
  },
  117: {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
    description: 'Diverse landscape unity',
    photographer: 'Qingbao Meng',
    source: 'Unsplash',
    theme: 'all nations, praise'
  },
  121: {
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&h=1080&fit=crop&auto=format',
    description: 'Hills at sunrise',
    photographer: 'John Towner',
    source: 'Unsplash',
    theme: 'help, horizon'
  },
  133: {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&auto=format',
    description: 'Harmonious forest',
    photographer: 'Steve Halama',
    source: 'Unsplash',
    theme: 'unity, dwelling together'
  },
  139: {
    url: 'https://images.unsplash.com/photo-1458419948946-19fb2cc296af?w=1920&h=1080&fit=crop&auto=format',
    description: 'Intricate nature details',
    photographer: 'John Salzarulo',
    source: 'Unsplash',
    theme: 'fearfully made, known'
  },
  148: {
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop&auto=format',
    description: 'Heavenly sky praise',
    photographer: 'Glenn Carstens-Peters',
    source: 'Unsplash',
    theme: 'heavens, praise'
  },
  150: {
    url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop&auto=format',
    description: 'Vibrant celebration of creation',
    photographer: 'Cosmic Timetraveler',
    source: 'Unsplash',
    theme: 'praise, everything that breathes'
  }
};

// Default nature images for psalms not yet curated
const defaultNatureImages = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&auto=format'
];

async function generateCuratedPsalmImages() {
  console.log('🖼️ Generating curated psalm images...');
  
  const psalmImages = {};
  
  for (let psalmNumber = 1; psalmNumber <= 150; psalmNumber++) {
    let imageData = curatedPsalmImages[psalmNumber];
    
    if (!imageData) {
      // Use a default nature image
      const defaultIndex = psalmNumber % defaultNatureImages.length;
      imageData = {
        url: defaultNatureImages[defaultIndex],
        description: `Peaceful nature scene for Psalm ${psalmNumber}`,
        photographer: 'Unsplash Collection',
        source: 'Unsplash',
        theme: 'nature, peace'
      };
    }
    
    psalmImages[psalmNumber] = {
      id: `psalm-${psalmNumber}`,
      url: imageData.url,
      urlSmall: imageData.url.replace('w=1920&h=1080', 'w=800&h=600'),
      urlFull: imageData.url.replace('w=1920&h=1080', 'w=2400&h=1600'),
      description: imageData.description,
      photographer: imageData.photographer,
      photographerUrl: 'https://unsplash.com',
      source: imageData.source,
      theme: imageData.theme
    };
    
    console.log(`✓ Curated image for Psalm ${psalmNumber}: ${imageData.description}`);
  }
  
  // Generate TypeScript file
  const outputPath = path.join(__dirname, '../data/psalmImages.ts');
  const output = `// Curated Psalm Images
// Generated on ${new Date().toISOString()}
// Free to use images with proper attribution

export interface PsalmImage {
  id: string;
  url: string;
  urlSmall: string;
  urlFull: string;
  description: string;
  photographer: string;
  photographerUrl: string;
  source: string;
  theme: string;
}

export const psalmImages: Record<number, PsalmImage> = ${JSON.stringify(psalmImages, null, 2)};

export function getPsalmImage(psalmNumber: number): PsalmImage | undefined {
  return psalmImages[psalmNumber];
}

export function getAttributionText(image: PsalmImage): string {
  return \`Photo by \${image.photographer} on \${image.source}\`;
}

export function getAttributionHTML(image: PsalmImage): string {
  return \`Photo by <a href="\${image.photographerUrl}">\${image.photographer}</a> on <a href="https://unsplash.com">\${image.source}</a>\`;
}

// Helper to get theme-appropriate image
export function getImageByTheme(theme: string): PsalmImage | undefined {
  return Object.values(psalmImages).find(img => img.theme.includes(theme));
}
`;

  fs.writeFileSync(outputPath, output, 'utf8');
  
  console.log(`\n✅ Generated curated psalm images!`);
  console.log(`🖼️ Total images: ${Object.keys(psalmImages).length}`);
  console.log(`🎨 Curated images: ${Object.keys(curatedPsalmImages).length}`);
  console.log(`💾 Saved to: ${outputPath}`);
  
  console.log(`\n📋 Next steps:`);
  console.log(`1. Images are ready to use immediately`);
  console.log(`2. All images are free with proper attribution`);
  console.log(`3. You can gradually replace default images with more specific ones`);
  console.log(`4. Apply for Unsplash production when ready`);
}

if (require.main === module) {
  generateCuratedPsalmImages().catch(console.error);
}

module.exports = { generateCuratedPsalmImages };
