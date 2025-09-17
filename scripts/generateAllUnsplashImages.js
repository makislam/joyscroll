/**
 * Node.js Script to Generate All Psalm Images from Unsplash
 * Run with: node scripts/generateAllUnsplashImages.js
 */

const fs = require('fs');
const path = require('path');

// Unsplash API configuration
const UNSPLASH_API_KEY = 'hVg9cilZ7J1F_xX7q4xUu19BIsl4_btLPPoxJhuzqL4';
const BASE_URL = 'https://api.unsplash.com';
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

// Psalm themes for image search
const psalmThemes = {
  1: ['flourishing tree', 'river stream', 'fruitful tree', 'flowing water'],
  2: ['mountain majesty', 'throne room', 'royal crown', 'divine authority'],
  3: ['morning sunrise', 'shield protection', 'peaceful sleep', 'divine refuge'],
  4: ['peaceful rest', 'evening calm', 'inner peace', 'quiet meadow'],
  5: ['morning prayer', 'sunrise worship', 'temple light', 'sacred space'],
  6: ['healing waters', 'comfort embrace', 'restoration hope', 'gentle care'],
  7: ['righteous justice', 'divine protection', 'shelter storm', 'safe harbor'],
  8: ['starry night', 'cosmic wonder', 'night sky', 'majestic creation'],
  9: ['victory celebration', 'triumphant joy', 'fortress strength', 'jubilant praise'],
  10: ['hidden refuge', 'protective cover', 'storm shelter', 'divine hiding'],
  11: ['mountain fortress', 'rock foundation', 'secure refuge', 'unshakeable ground'],
  12: ['pure silver', 'refined gold', 'crystal clear', 'pristine water'],
  13: ['dawn breaking', 'hope rising', 'new morning', 'emerging light'],
  14: ['fool wandering', 'lost path', 'searching heart', 'divine wisdom'],
  15: ['holy mountain', 'sacred peak', 'temple height', 'divine dwelling'],
  16: ['joyful heart', 'pleasant places', 'beautiful inheritance', 'blessed land'],
  17: ['protective wings', 'shelter embrace', 'divine care', 'loving protection'],
  18: ['lightning storm', 'thunder power', 'earthquake strength', 'divine might'],
  19: ['golden sunrise', 'heavens declare', 'solar brilliance', 'morning glory'],
  20: ['battle victory', 'divine help', 'strength courage', 'triumphant banner'],
  21: ['royal crown', 'golden majesty', 'kingly glory', 'divine blessing'],
  22: ['desert thirst', 'wilderness journey', 'suffering hope', 'distant rescue'],
  23: ['green pasture', 'still waters', 'peaceful meadow', 'shepherd care'],
  24: ['mountain ascent', 'temple gates', 'holy hill', 'divine entrance'],
  25: ['upward gaze', 'hopeful eyes', 'mountain view', 'seeking heaven'],
  26: ['temple worship', 'altar service', 'sacred space', 'holy devotion'],
  27: ['bright light', 'lighthouse beacon', 'divine illumination', 'radiant hope'],
  28: ['rock foundation', 'stone fortress', 'solid ground', 'unshakeable base'],
  29: ['thunderstorm', 'mighty waters', 'forest storm', 'divine power'],
  30: ['dancing joy', 'celebration feast', 'morning gladness', 'restored life'],
  31: ['fortress refuge', 'rock shelter', 'safe haven', 'protective walls'],
  32: ['forgiveness rain', 'cleansing water', 'fresh start', 'clear conscience'],
  33: ['new song', 'musical praise', 'joyful melody', 'celebration music'],
  34: ['angelic protection', 'divine guardians', 'heavenly watch', 'safe keeping'],
  35: ['righteous vindication', 'divine justice', 'truth prevailing', 'honest victory'],
  36: ['fountain life', 'river pleasure', 'abundant flow', 'life-giving spring'],
  37: ['patient waiting', 'quiet trust', 'peaceful endurance', 'steady hope'],
  38: ['heavy burden', 'weary soul', 'restoration need', 'healing touch'],
  39: ['brief life', 'passing shadow', 'temporal existence', 'eternal perspective'],
  40: ['patient waiting', 'answered prayer', 'new song', 'joyful testimony'],
  41: ['healing restoration', 'sickbed comfort', 'gentle care', 'renewed strength'],
  42: ['deer water', 'thirsty soul', 'flowing stream', 'longing heart'],
  43: ['divine light', 'truth guidance', 'holy mountain', 'altar joy'],
  44: ['ancient days', 'forgotten glory', 'past victories', 'historical faith'],
  45: ['royal wedding', 'bridal beauty', 'palace splendor', 'majestic ceremony'],
  46: ['mountain refuge', 'earthquake calm', 'fortress strength', 'still waters'],
  47: ['triumphant king', 'victory shout', 'royal ascension', 'joyful acclaim'],
  48: ['holy city', 'beautiful mountain', 'Zion glory', 'divine dwelling'],
  49: ['wisdom teaching', 'life lessons', 'eternal perspective', 'true riches'],
  50: ['divine judgment', 'consuming fire', 'perfect beauty', 'righteous authority'],
  51: ['clean heart', 'washing water', 'pure snow', 'forgiven soul'],
  52: ['green olive', 'flourishing tree', 'steadfast love', 'growing faith'],
  53: ['corrupt fool', 'seeking God', 'divine search', 'righteous remnant'],
  54: ['divine helper', 'strong support', 'protective power', 'faithful friend'],
  55: ['dove wings', 'peaceful flight', 'quiet rest', 'safe escape'],
  56: ['trusting heart', 'fearless faith', 'divine protection', 'confident hope'],
  57: ['shadow wings', 'protective cover', 'storm shelter', 'safe refuge'],
  58: ['righteous judgment', 'divine justice', 'truth prevailing', 'honest verdict'],
  59: ['high tower', 'fortress strength', 'protective height', 'safe elevation'],
  60: ['battle standard', 'victory banner', 'divine help', 'triumphant flag'],
  61: ['rock height', 'tower strength', 'elevated refuge', 'high sanctuary'],
  62: ['silent soul', 'quiet waiting', 'peaceful rest', 'still trust'],
  63: ['desert thirst', 'dry land', 'seeking water', 'spiritual hunger'],
  64: ['hidden protection', 'secret shelter', 'divine concealment', 'safe hiding'],
  65: ['harvest abundance', 'fertile fields', 'rich provision', 'bountiful crops'],
  66: ['awesome deeds', 'mighty works', 'divine power', 'fearful reverence'],
  67: ['blessing nations', 'global harvest', 'worldwide joy', 'universal praise'],
  68: ['victory procession', 'triumphant march', 'divine warrior', 'conquering king'],
  69: ['deep waters', 'overwhelming flood', 'sinking mud', 'rescue hope'],
  70: ['urgent help', 'quick rescue', 'immediate aid', 'swift salvation'],
  71: ['lifelong trust', 'aging faith', 'enduring hope', 'constant refuge'],
  72: ['righteous king', 'just ruler', 'peaceful reign', 'prosperous kingdom'],
  73: ['pure heart', 'clean hands', 'moral clarity', 'righteous living'],
  74: ['broken sanctuary', 'destroyed temple', 'ruined worship', 'restoration hope'],
  75: ['divine judgment', 'righteous scales', 'just verdict', 'fair balance'],
  76: ['terrible majesty', 'awesome power', 'fearful glory', 'divine strength'],
  77: ['sleepless night', 'troubled mind', 'seeking comfort', 'remembering God'],
  78: ['teaching children', 'passing wisdom', 'generational faith', 'inherited truth'],
  79: ['broken walls', 'destroyed city', 'national grief', 'restoration plea'],
  80: ['vine restoration', 'planted growth', 'flourishing branches', 'fruitful garden'],
  81: ['festival joy', 'celebration feast', 'musical worship', 'joyful assembly'],
  82: ['divine council', 'heavenly court', 'righteous judgment', 'cosmic justice'],
  83: ['enemy alliance', 'protective shield', 'divine defense', 'victorious God'],
  84: ['lovely dwelling', 'beautiful temple', 'sacred courts', 'holy habitation'],
  85: ['restored land', 'revived nation', 'renewed blessing', 'divine favor'],
  86: ['undivided heart', 'single devotion', 'pure worship', 'unified soul'],
  87: ['glorious city', 'noble birth', 'honored citizenship', 'divine registration'],
  88: ['darkest night', 'deepest pit', 'overwhelming sorrow', 'desperate cry'],
  89: ['faithful love', 'steadfast mercy', 'covenant promise', 'enduring commitment'],
  90: ['eternal dwelling', 'mountain foundation', 'timeless refuge', 'ancient home'],
  91: ['eagle wings', 'protective feathers', 'divine shelter', 'safe dwelling'],
  92: ['flourishing palm', 'cedar growth', 'righteous prosperity', 'aged fruitfulness'],
  93: ['mighty waters', 'crashing waves', 'divine throne', 'eternal reign'],
  94: ['divine justice', 'righteous judgment', 'protecting orphan', 'defending widow'],
  95: ['joyful singing', 'rock salvation', 'worship celebration', 'grateful praise'],
  96: ['new song', 'global worship', 'universal praise', 'worldwide joy'],
  97: ['lightning flash', 'mountain fire', 'divine glory', 'awesome majesty'],
  98: ['victory song', 'triumphant music', 'joyful noise', 'celebration hymn'],
  99: ['holy mountain', 'divine throne', 'awesome king', 'sacred worship'],
  100: ['joyful noise', 'glad singing', 'thanksgiving gates', 'praise courts'],
  101: ['perfect way', 'blameless walk', 'pure heart', 'righteous living'],
  102: ['withered grass', 'fading flower', 'eternal foundation', 'lasting truth'],
  103: ['soaring eagle', 'renewed youth', 'divine healing', 'restored strength'],
  104: ['creative wonder', 'natural beauty', 'diverse creation', 'living earth'],
  105: ['covenant remembrance', 'faithful promise', 'historical mercy', 'enduring love'],
  106: ['persistent rebellion', 'patient mercy', 'forgiving grace', 'restored relationship'],
  107: ['desert wandering', 'storm calming', 'prison breaking', 'healing touch'],
  108: ['steadfast heart', 'morning praise', 'confident worship', 'joyful song'],
  109: ['righteous vindication', 'divine justice', 'protective help', 'faithful defense'],
  110: ['royal priesthood', 'eternal throne', 'divine appointment', 'kingly authority'],
  111: ['great works', 'wonderful deeds', 'awesome acts', 'marvelous creation'],
  112: ['righteous prosperity', 'generous giving', 'steadfast heart', 'fearless trust'],
  113: ['exalted throne', 'humble care', 'divine majesty', 'loving kindness'],
  114: ['trembling earth', 'skipping mountains', 'divine presence', 'awesome power'],
  115: ['living God', 'breathing life', 'seeing eyes', 'hearing ears'],
  116: ['grateful heart', 'answered prayer', 'delivered soul', 'faithful promise'],
  117: ['universal praise', 'global worship', 'worldwide celebration', 'international joy'],
  118: ['cornerstone foundation', 'rejected stone', 'divine reversal', 'surprising choice'],
  119: ['golden path', 'lamp light', 'word treasure', 'truth guidance'],
  120: ['peace desire', 'war weariness', 'harmony longing', 'conflict resolution'],
  121: ['mountain help', 'hill strength', 'divine assistance', 'elevated aid'],
  122: ['Jerusalem peace', 'city unity', 'gathered worship', 'collective joy'],
  123: ['upward eyes', 'servant attention', 'master focus', 'humble dependence'],
  124: ['escape bird', 'broken snare', 'freedom flight', 'divine rescue'],
  125: ['mountain stability', 'unshakeable foundation', 'eternal security', 'lasting peace'],
  126: ['joyful return', 'harvest celebration', 'dream fulfillment', 'restored fortune'],
  127: ['building foundation', 'city protection', 'divine blessing', 'fruitful family'],
  128: ['blessed family', 'fruitful vine', 'olive branches', 'prosperous household'],
  129: ['plowed back', 'furrow scars', 'endured suffering', 'survived persecution'],
  130: ['deep cry', 'waiting soul', 'morning watch', 'hopeful expectation'],
  131: ['quiet soul', 'weaned child', 'peaceful heart', 'humble spirit'],
  132: ['dwelling place', 'resting ark', 'chosen habitation', 'divine residence'],
  133: ['unity blessing', 'harmonious brothers', 'precious oil', 'refreshing dew'],
  134: ['night blessing', 'temple service', 'lifted hands', 'worship praise'],
  135: ['chosen people', 'treasured possession', 'divine selection', 'special inheritance'],
  136: ['enduring love', 'steadfast mercy', 'faithful kindness', 'eternal commitment'],
  137: ['weeping willows', 'flowing rivers', 'mournful exile', 'remembered Zion'],
  138: ['wholehearted praise', 'temple worship', 'grateful acknowledgment', 'faithful testimony'],
  139: ['fearfully made', 'wonderfully created', 'intricate design', 'divine craftsmanship'],
  140: ['evil rescue', 'violent protection', 'dangerous escape', 'safe deliverance'],
  141: ['evening incense', 'lifted hands', 'prayer offering', 'worship fragrance'],
  142: ['cave refuge', 'hidden shelter', 'secret protection', 'lonely cry'],
  143: ['morning light', 'dawn hope', 'new beginning', 'fresh mercy'],
  144: ['trained hands', 'skilled fingers', 'divine teaching', 'equipped service'],
  145: ['generous provision', 'abundant supply', 'gracious giving', 'satisfied hunger'],
  146: ['mortal breath', 'divine trust', 'eternal hope', 'lasting refuge'],
  147: ['healing broken', 'binding wounds', 'counting stars', 'calling names'],
  148: ['universal praise', 'cosmic worship', 'creation symphony', 'heavenly choir'],
  149: ['victory dance', 'triumphant celebration', 'joyful movement', 'festive worship'],
  150: ['ultimate praise', 'everything breathing', 'total celebration', 'complete worship']
};

const fallbackTerms = [
  'peaceful forest nature',
  'serene mountain landscape',
  'spiritual garden light',
  'divine botanical beauty',
  'sacred tree geometry',
  'tranquil flowing water',
  'golden nature hour',
  'morning dew plants',
  'gentle forest breeze',
  'ethereal flower glow'
];

// Helper functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchPhotos(query) {
  // Add nature/plant focused terms and exclude terms with faces/phones
  const natureQuery = `${query} nature landscape plants trees flowers mountains water -face -phone -person -people -portrait -selfie -technology`;
  const url = `${BASE_URL}/search/photos?query=${encodeURIComponent(natureQuery)}&per_page=30&orientation=portrait&order_by=relevant&content_filter=high`;
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`,
        'Accept-Version': 'v1'
      }
    });

    if (!response.ok) {
      console.error(`Search failed for "${natureQuery}": ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Filter results to ensure they're nature-focused and don't contain faces/phones
      const filteredResults = data.results.filter(photo => {
        const description = (photo.description || '').toLowerCase();
        const altDescription = (photo.alt_description || '').toLowerCase();
        const tags = (photo.tags || []).map(tag => tag.title.toLowerCase()).join(' ');
        
        const allText = `${description} ${altDescription} ${tags}`;
        
        // Exclude photos with face/phone/people keywords
        const excludeTerms = ['face', 'phone', 'person', 'people', 'portrait', 'selfie', 'man', 'woman', 'human', 'child', 'boy', 'girl', 'smartphone', 'mobile'];
        const hasExcludedTerms = excludeTerms.some(term => allText.includes(term));
        
        // Prefer photos with nature keywords
        const natureTerms = ['nature', 'landscape', 'tree', 'flower', 'plant', 'mountain', 'water', 'sky', 'forest', 'garden', 'leaf', 'sunset', 'sunrise', 'ocean', 'lake', 'river'];
        const hasNatureTerms = natureTerms.some(term => allText.includes(term));
        
        return !hasExcludedTerms && (hasNatureTerms || allText.length === 0); // Include if no description but no excluded terms
      });
      
      if (filteredResults.length > 0) {
        // Select a random image from the filtered results
        const randomIndex = Math.floor(Math.random() * Math.min(10, filteredResults.length));
        return filteredResults[randomIndex];
      }
      
      // If no filtered results, try with a fallback nature-only search
      console.log(`🌿 No suitable nature images found for "${query}", trying nature fallback...`);
      return await searchNatureFallback();
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    return null;
  }
}

async function searchNatureFallback() {
  const pureNatureTerms = [
    'peaceful forest',
    'mountain landscape',
    'flowing river',
    'garden flowers',
    'tree branches',
    'morning sunlight',
    'nature scenery',
    'botanical garden',
    'wildflowers meadow',
    'serene lake'
  ];
  
  const randomTerm = pureNatureTerms[Math.floor(Math.random() * pureNatureTerms.length)];
  const fallbackQuery = `${randomTerm} -face -phone -person -people -portrait`;
  const url = `${BASE_URL}/search/photos?query=${encodeURIComponent(fallbackQuery)}&per_page=20&orientation=portrait&order_by=relevant&content_filter=high`;
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`,
        'Accept-Version': 'v1'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
      return data.results[randomIndex];
    }
    
    return null;
  } catch (error) {
    console.error(`Error in nature fallback search:`, error);
    return null;
  }
}

async function triggerDownload(downloadLocation) {
  try {
    const fetch = (await import('node-fetch')).default;
    await fetch(downloadLocation, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
      }
    });
  } catch (error) {
    console.error('Error triggering download:', error);
  }
}

async function fetchImageForPsalm(psalmNumber) {
  const themes = psalmThemes[psalmNumber] || fallbackTerms.slice(0, 4);
  
  console.log(`🎨 Fetching image for Psalm ${psalmNumber}...`);
  
  // Try each theme until we find a good image
  for (const theme of themes) {
    try {
      const photo = await searchPhotos(theme);
      
      if (photo) {
        const imageData = {
          psalmNumber,
          imageUrl: photo.urls.regular,
          thumbnailUrl: photo.urls.thumb,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
          downloadLocation: photo.links.download_location,
          attribution: `Photo by ${photo.user.name} on Unsplash`,
          searchTerms: themes,
          fetchedAt: new Date().toISOString()
        };
        
        console.log(`✅ Found image for Psalm ${psalmNumber} (theme: "${theme}", by ${photo.user.name})`);
        
        // Trigger download for compliance
        await triggerDownload(imageData.downloadLocation);
        
        return imageData;
      }
      
      // Rate limiting - wait between searches
      await sleep(RATE_LIMIT_DELAY);
      
    } catch (error) {
      console.error(`Error fetching image for Psalm ${psalmNumber} with theme "${theme}":`, error);
      await sleep(RATE_LIMIT_DELAY);
    }
  }
  
  console.warn(`❌ No image found for Psalm ${psalmNumber}`);
  return null;
}

async function fetchAllPsalmImages(startPsalm = 1, endPsalm = 150) {
  const results = [];
  const failed = [];
  
  console.log(`🚀 Starting bulk fetch for Psalms ${startPsalm}-${endPsalm}`);
  console.log(`⏱️  Rate limit: ${RATE_LIMIT_DELAY}ms between requests`);
  
  for (let psalmNumber = startPsalm; psalmNumber <= endPsalm; psalmNumber++) {
    const imageData = await fetchImageForPsalm(psalmNumber);
    
    if (imageData) {
      results.push(imageData);
      
      // Progress update every 10 psalms
      if (psalmNumber % 10 === 0) {
        console.log(`📈 Progress: ${results.length}/${psalmNumber - startPsalm + 1} images fetched`);
      }
    } else {
      failed.push(psalmNumber);
    }
    
    // Rate limiting between psalms
    await sleep(RATE_LIMIT_DELAY);
  }
  
  console.log(`\n🎉 Bulk fetch completed!`);
  console.log(`✅ Successfully fetched: ${results.length} images`);
  console.log(`❌ Failed to fetch: ${failed.length} images`);
  
  if (failed.length > 0) {
    console.log(`Failed psalms: ${failed.join(', ')}`);
  }
  
  return results;
}

async function generatePsalmImageFile() {
  console.log('🎯 Fetching images for all 150 psalms...');
  const imageData = await fetchAllPsalmImages();
  
  if (imageData.length === 0) {
    console.error('❌ No images were fetched. Cannot generate file.');
    return;
  }
  
  // Convert to the format expected by the app
  const psalmImages = imageData.reduce((acc, data) => {
    acc[data.psalmNumber] = {
      url: data.imageUrl,
      thumbnail: data.thumbnailUrl,
      photographer: data.photographer,
      photographerUrl: data.photographerUrl,
      attribution: data.attribution,
      source: 'unsplash',
      downloadLocation: data.downloadLocation
    };
    return acc;
  }, {});
  
  const fileContent = `/**
 * Dynamically Generated Unsplash Images for All 150 Psalms
 * Generated on: ${new Date().toISOString()}
 * Total images: ${imageData.length}
 */

export interface PsalmImage {
  url: string;
  thumbnail: string;
  photographer: string;
  photographerUrl: string;
  attribution: string;
  source: 'unsplash';
  downloadLocation: string;
}

export const unsplashPsalmImages: Record<number, PsalmImage> = ${JSON.stringify(psalmImages, null, 2)};

// Metadata about the image generation
export const generationMetadata = {
  generatedAt: '${new Date().toISOString()}',
  totalImages: ${imageData.length},
  failedPsalms: [${imageData.length < 150 ? 
    Array.from({length: 150}, (_, i) => i + 1)
      .filter(n => !imageData.find(d => d.psalmNumber === n))
      .join(', ') : ''
  }],
  apiKey: 'Production API (hVg9cilZ7J1F_xX7q4xUu19BIsl4_btLPPoxJhuzqL4)',
  source: 'Unsplash Production API'
};

export default unsplashPsalmImages;`;
  
  // Write to file
  const outputPath = path.join(__dirname, '..', 'data', 'unsplashPsalmImages.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf8');
  
  console.log('📝 Generated psalm images file:');
  console.log(`File path: ${outputPath}`);
  console.log(`Content length: ${fileContent.length} characters`);
  console.log('✅ File generation completed!');
}

// Main execution
if (require.main === module) {
  generatePsalmImageFile()
    .then(() => {
      console.log('🎉 All done! Your app now has premium Unsplash images for all 150 psalms.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error generating psalm images:', error);
      process.exit(1);
    });
}