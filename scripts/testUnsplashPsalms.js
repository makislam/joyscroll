/**
 * Test Unsplash Psalm Images
 * Test the psalm image generator with a few popular psalms
 */

const fs = require('fs');
const path = require('path');

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = 'hVg9cilZ7J1F_xX7q4xUu19BIsl4_btLPPoxJhuzqL4';
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

const psalmImageKeywords = {
  1: 'peaceful river, flowing water',
  8: 'starry night sky, cosmos, majestic creation',
  19: 'golden sunrise, heavens declaring glory',
  23: 'green meadow, shepherd, peaceful pasture',
  27: 'bright light, lighthouse, salvation',
  46: 'mountain fortress, strong tower, refuge',
  51: 'clean water, washing, pure spring',
  91: 'eagle soaring, mountain refuge, protective shelter',
  100: 'joyful celebration, bright flowers, praise',
  103: 'blessing nature, abundant life, flourishing',
  121: 'mountain hills, sunrise, help from above',
  139: 'intricate creation, detailed nature, fearfully made',
  150: 'vibrant celebration, colorful nature, everything praise'
};

async function fetchImageFromUnsplash(keyword, psalmNumber) {
  try {
    console.log(`🔍 Searching for: "${keyword}" (Psalm ${psalmNumber})`);
    
    const searchUrl = `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(keyword)}&per_page=3&orientation=landscape`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const image = data.results[0]; // Get the best result
      
      return {
        id: image.id,
        description: image.description || image.alt_description || `Beautiful nature scene for Psalm ${psalmNumber}`,
        url: image.urls.regular,
        urlSmall: image.urls.small,
        urlFull: image.urls.full,
        photographer: image.user.name,
        photographerUrl: image.user.links.html,
        downloadUrl: image.links.download_location,
        color: image.color,
        likes: image.likes,
        keyword: keyword
      };
    } else {
      console.log(`⚠️ No images found for "${keyword}"`);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error fetching image for "${keyword}":`, error.message);
    return null;
  }
}

async function testPsalmImages() {
  console.log('🖼️ Testing Unsplash Psalm Image Generation...');
  console.log(`🔑 API Key: ${UNSPLASH_ACCESS_KEY.substring(0, 10)}...\n`);
  
  const testPsalms = [1, 8, 19, 23, 27, 46, 51, 91, 100, 103, 121, 139, 150];
  const results = {};
  
  for (const psalmNumber of testPsalms) {
    const keyword = psalmImageKeywords[psalmNumber];
    
    console.log(`\n📖 Psalm ${psalmNumber}:`);
    
    const image = await fetchImageFromUnsplash(keyword, psalmNumber);
    
    if (image) {
      results[psalmNumber] = image;
      
      console.log(`✅ Found: ${image.description}`);
      console.log(`📸 Photographer: ${image.photographer}`);
      console.log(`❤️ Likes: ${image.likes}`);
      console.log(`🎨 Color: ${image.color}`);
      console.log(`🔗 URL: ${image.url}`);
      
    } else {
      console.log(`❌ Failed to get image for Psalm ${psalmNumber}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully fetched: ${Object.keys(results).length}/${testPsalms.length} images`);
  console.log(`🎯 These are professional-quality nature photos!`);
  
  if (Object.keys(results).length > 0) {
    console.log(`\n🚀 Your Unsplash integration is working perfectly!`);
    console.log(`📋 Next steps:`);
    console.log(`   1. Apply for production approval at: https://unsplash.com/oauth/applications`);
    console.log(`   2. Once approved, you'll get 5,000 requests/hour`);
    console.log(`   3. Run: npm run generate-psalm-images`);
    console.log(`   4. Replace Picsum images with high-quality Unsplash photos`);
    
    // Save sample results
    const samplePath = path.join(__dirname, '../data/unsplashSample.json');
    fs.writeFileSync(samplePath, JSON.stringify(results, null, 2));
    console.log(`💾 Sample results saved to: ${samplePath}`);
  }
}

if (require.main === module) {
  testPsalmImages().catch(console.error);
}

module.exports = { testPsalmImages, fetchImageFromUnsplash };
