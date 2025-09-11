/**
 * Populate Psalms with ESV API
 * Fetches all 150 psalms from the ESV API and populates our psalm data
 */

const fs = require('fs');
const path = require('path');

// ESV API Configuration
const ESV_API_KEY = process.env.ESV_API_KEY || 'f6b6949443e6071c10515ce8c8bcce519d579600';
const ESV_API_BASE = 'https://api.esv.org/v3/passage/text/';

// Delay between API calls to respect rate limits
const API_DELAY = 100; // 100ms between requests

// Psalm titles mapping (from our previous script)
const psalmTitles = {
  1: "The Way of the Righteous and the Wicked",
  2: "Why Do the Nations Rage?",
  3: "A Psalm of David When He Fled from Absalom",
  4: "Answer Me When I Call",
  5: "Give Ear to My Words, O Lord",
  6: "O Lord, Rebuke Me Not",
  7: "In You Do I Take Refuge",
  8: "How Majestic Is Your Name",
  9: "I Will Give Thanks to the Lord",
  10: "Why Do You Hide Yourself?",
  11: "The Lord Is in His Holy Temple",
  12: "Save, O Lord, for the Godly One Is Gone",
  13: "How Long, O Lord?",
  14: "The Fool Says There Is No God",
  15: "Who Shall Dwell on Your Holy Hill?",
  16: "You Will Not Abandon My Soul",
  17: "Hear a Just Cause, O Lord",
  18: "The Lord Is My Rock",
  19: "The Heavens Declare the Glory of God",
  20: "May the Lord Answer You",
  21: "In Your Strength the King Rejoices",
  22: "My God, My God, Why Have You Forsaken Me?",
  23: "The Lord Is My Shepherd",
  24: "The Earth Is the Lord's",
  25: "To You, O Lord, I Lift Up My Soul",
  26: "Vindicate Me, O Lord",
  27: "The Lord Is My Light and My Salvation",
  28: "To You, O Lord, I Call",
  29: "Ascribe to the Lord Glory",
  30: "I Will Extol You, O Lord",
  31: "In You, O Lord, Do I Take Refuge",
  32: "Blessed Is the One Whose Transgression Is Forgiven",
  33: "Shout for Joy in the Lord",
  34: "I Will Bless the Lord at All Times",
  35: "Contend, O Lord, with Those Who Contend with Me",
  36: "Transgression Speaks to the Wicked",
  37: "Fret Not Yourself Because of Evildoers",
  38: "O Lord, Rebuke Me Not in Your Anger",
  39: "I Said, I Will Guard My Ways",
  40: "I Waited Patiently for the Lord",
  41: "Blessed Is the One Who Considers the Poor",
  42: "As a Deer Pants for Flowing Streams",
  43: "Vindicate Me, O God",
  44: "O God, We Have Heard with Our Ears",
  45: "My Heart Overflows with a Pleasing Theme",
  46: "God Is Our Refuge and Strength",
  47: "Clap Your Hands, All Peoples",
  48: "Great Is the Lord and Greatly to Be Praised",
  49: "Hear This, All Peoples",
  50: "The Mighty One, God the Lord, Speaks",
  51: "Create in Me a Clean Heart, O God",
  52: "Why Do You Boast of Evil?",
  53: "The Fool Says There Is No God",
  54: "Save Me, O God, by Your Name",
  55: "Give Ear to My Prayer, O God",
  56: "Be Gracious to Me, O God",
  57: "Be Merciful to Me, O God",
  58: "Do You Indeed Decree What Is Right?",
  59: "Deliver Me from My Enemies, O My God",
  60: "O God, You Have Rejected Us",
  61: "Hear My Cry, O God",
  62: "For God Alone My Soul Waits in Silence",
  63: "O God, You Are My God",
  64: "Hear My Voice, O God",
  65: "Praise Is Due to You, O God, in Zion",
  66: "Shout for Joy to God, All the Earth",
  67: "May God Be Gracious to Us",
  68: "God Shall Arise, His Enemies Shall Be Scattered",
  69: "Save Me, O God",
  70: "Make Haste, O God, to Deliver Me",
  71: "In You, O Lord, Do I Take Refuge",
  72: "Give the King Your Justice, O God",
  73: "Truly God Is Good to Israel",
  74: "O God, Why Do You Cast Us Off Forever?",
  75: "We Give Thanks to You, O God",
  76: "In Judah God Is Known",
  77: "I Cry Aloud to God",
  78: "Give Ear, O My People, to My Teaching",
  79: "O God, the Nations Have Come",
  80: "Give Ear, O Shepherd of Israel",
  81: "Sing Aloud to God Our Strength",
  82: "God Has Taken His Place",
  83: "O God, Do Not Keep Silence",
  84: "How Lovely Is Your Dwelling Place",
  85: "Lord, You Were Favorable to Your Land",
  86: "Incline Your Ear, O Lord",
  87: "On the Holy Mount Stands the City He Founded",
  88: "O Lord, God of My Salvation",
  89: "I Will Sing of the Steadfast Love of the Lord",
  90: "Lord, You Have Been Our Dwelling Place",
  91: "He Who Dwells in the Shelter of the Most High",
  92: "It Is Good to Give Thanks to the Lord",
  93: "The Lord Reigns, He Is Robed in Majesty",
  94: "O Lord, God of Vengeance",
  95: "Oh Come, Let Us Sing to the Lord",
  96: "Oh Sing to the Lord a New Song",
  97: "The Lord Reigns, Let the Earth Rejoice",
  98: "Oh Sing to the Lord a New Song",
  99: "The Lord Reigns; Let the Peoples Tremble",
  100: "Make a Joyful Noise to the Lord",
  101: "I Will Sing of Steadfast Love and Justice",
  102: "Hear My Prayer, O Lord",
  103: "Bless the Lord, O My Soul",
  104: "Bless the Lord, O My Soul",
  105: "Oh Give Thanks to the Lord",
  106: "Praise the Lord! Oh Give Thanks to the Lord",
  107: "Oh Give Thanks to the Lord, for He Is Good",
  108: "My Heart Is Steadfast, O God",
  109: "Do Not Be Silent, O God of My Praise",
  110: "The Lord Says to My Lord",
  111: "Praise the Lord!",
  112: "Praise the Lord!",
  113: "Praise the Lord!",
  114: "When Israel Went Out from Egypt",
  115: "Not to Us, O Lord, Not to Us",
  116: "I Love the Lord, Because He Has Heard",
  117: "Praise the Lord, All Nations",
  118: "Oh Give Thanks to the Lord, for He Is Good",
  119: "Blessed Are Those Whose Way Is Blameless",
  120: "In My Distress I Called to the Lord",
  121: "I Lift Up My Eyes to the Hills",
  122: "I Was Glad When They Said to Me",
  123: "To You I Lift Up My Eyes",
  124: "If It Had Not Been the Lord Who Was on Our Side",
  125: "Those Who Trust in the Lord Are Like Mount Zion",
  126: "When the Lord Restored the Fortunes of Zion",
  127: "Unless the Lord Builds the House",
  128: "Blessed Is Everyone Who Fears the Lord",
  129: "Greatly Have They Afflicted Me from My Youth",
  130: "Out of the Depths I Cry to You, O Lord",
  131: "O Lord, My Heart Is Not Lifted Up",
  132: "Remember, O Lord, in David's Favor",
  133: "Behold, How Good and Pleasant It Is",
  134: "Come, Bless the Lord",
  135: "Praise the Lord!",
  136: "Give Thanks to the Lord, for He Is Good",
  137: "By the Waters of Babylon",
  138: "I Give You Thanks, O Lord",
  139: "O Lord, You Have Searched Me",
  140: "Deliver Me, O Lord, from Evil Men",
  141: "O Lord, I Call Upon You",
  142: "With My Voice I Cry Out to the Lord",
  143: "Hear My Prayer, O Lord",
  144: "Blessed Be the Lord, My Rock",
  145: "I Will Extol You, My God and King",
  146: "Praise the Lord!",
  147: "Praise the Lord!",
  148: "Praise the Lord!",
  149: "Praise the Lord!",
  150: "Praise the Lord!"
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPsalmFromESV(psalmNumber) {
  console.log(`📖 Fetching Psalm ${psalmNumber} from ESV API...`);
  
  const query = `Psalm ${psalmNumber}`;
  const url = `${ESV_API_BASE}?q=${encodeURIComponent(query)}&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=false`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${ESV_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`ESV API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.passages || data.passages.length === 0) {
      throw new Error(`No passages found for Psalm ${psalmNumber}`);
    }
    
    return data.passages[0];
  } catch (error) {
    console.error(`❌ Error fetching Psalm ${psalmNumber}:`, error.message);
    return null;
  }
}

function parseEsvPassage(rawText, psalmNumber) {
  if (!rawText) return null;
  
  // Remove the psalm header and clean up the text
  let cleanText = rawText.replace(/^Psalm \d+\s*\n\n/, '');
  
  // Split into verses - ESV format has [verse] at the start of each verse
  const verseRegex = /\[(\d+)\]\s*([^[\n]+)/g;
  const verses = [];
  let match;
  
  while ((match = verseRegex.exec(cleanText)) !== null) {
    const verseNumber = parseInt(match[1]);
    let verseText = match[2].trim();
    
    // Clean up verse text
    verseText = verseText
      .replace(/\s+/g, ' ') // normalize whitespace
      .replace(/\s*\(ESV\)\s*$/, '') // remove ESV attribution
      .trim();
    
    if (verseText) {
      verses.push({
        id: `psalm-${psalmNumber}-${verseNumber}`,
        text: verseText,
        verseNumber: verseNumber
      });
    }
  }
  
  return verses;
}

async function populateAllPsalms() {
  console.log('📚 Starting ESV Psalm population...');
  console.log(`🔑 Using API key: ${ESV_API_KEY.substring(0, 8)}...`);
  console.log('⏱️ This will take a few minutes due to API rate limiting\n');
  
  const psalms = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (let psalmNumber = 1; psalmNumber <= 150; psalmNumber++) {
    try {
      const rawPassage = await fetchPsalmFromESV(psalmNumber);
      
      if (rawPassage) {
        const verses = parseEsvPassage(rawPassage, psalmNumber);
        
        if (verses && verses.length > 0) {
          const psalm = {
            number: psalmNumber,
            title: psalmTitles[psalmNumber] || `Psalm ${psalmNumber}`,
            verses: verses
          };
          
          psalms.push(psalm);
          successCount++;
          console.log(`✅ Psalm ${psalmNumber}: ${verses.length} verses`);
        } else {
          console.log(`⚠️ Psalm ${psalmNumber}: No verses parsed`);
          errorCount++;
        }
      } else {
        console.log(`❌ Psalm ${psalmNumber}: Failed to fetch`);
        errorCount++;
      }
      
      // Progress update
      if (psalmNumber % 10 === 0) {
        console.log(`\n📊 Progress: ${psalmNumber}/150 psalms processed`);
        console.log(`   ✅ Success: ${successCount} | ❌ Errors: ${errorCount}\n`);
      }
      
      // Rate limiting delay
      await sleep(API_DELAY);
      
    } catch (error) {
      console.error(`💥 Unexpected error for Psalm ${psalmNumber}:`, error.message);
      errorCount++;
    }
  }
  
  // Generate the output file
  const outputPath = path.join(__dirname, '../data/psalms.ts');
  const output = `import { Psalm } from '@/types'

// Complete Psalms data - All 150 Psalms from ESV
// Generated on ${new Date().toISOString()}
// Source: ESV API (api.esv.org)

export const psalmsData: Psalm[] = ${JSON.stringify(psalms, null, 2)};

// Helper functions
export function getPsalmByNumber(number: number): Psalm | undefined {
  return psalmsData.find(psalm => psalm.number === number);
}

export function getRandomPsalm(): Psalm {
  return psalmsData[Math.floor(Math.random() * psalmsData.length)];
}

export function getRandomVerse(): { psalm: Psalm; verse: any } {
  const psalm = getRandomPsalm();
  const verse = psalm.verses[Math.floor(Math.random() * psalm.verses.length)];
  return { psalm, verse };
}

export function searchPsalms(query: string): Psalm[] {
  const lowercaseQuery = query.toLowerCase();
  return psalmsData.filter(psalm => 
    psalm.title.toLowerCase().includes(lowercaseQuery) ||
    psalm.verses.some(verse => 
      verse.text.toLowerCase().includes(lowercaseQuery)
    )
  );
}

export function getPsalmsByTheme(theme: string): Psalm[] {
  const themeKeywords = {
    'praise': ['praise', 'glory', 'worship', 'sing', 'thanksgiving'],
    'comfort': ['comfort', 'peace', 'rest', 'refuge', 'shelter'],
    'protection': ['protect', 'shield', 'fortress', 'stronghold', 'defense'],
    'guidance': ['guide', 'path', 'way', 'lead', 'direct'],
    'forgiveness': ['forgive', 'mercy', 'grace', 'cleanse', 'pardon'],
    'trust': ['trust', 'faith', 'believe', 'rely', 'depend'],
    'strength': ['strength', 'power', 'mighty', 'strong', 'courage'],
    'love': ['love', 'steadfast', 'faithful', 'loyal', 'devotion']
  };
  
  const keywords = themeKeywords[theme.toLowerCase()] || [theme.toLowerCase()];
  
  return psalmsData.filter(psalm =>
    keywords.some(keyword =>
      psalm.title.toLowerCase().includes(keyword) ||
      psalm.verses.some(verse =>
        verse.text.toLowerCase().includes(keyword)
      )
    )
  );
}
`;

  fs.writeFileSync(outputPath, output, 'utf8');
  
  console.log(`\n🎉 ESV Psalm population complete!`);
  console.log(`📊 Final Stats:`);
  console.log(`   ✅ Successfully processed: ${successCount}/150 psalms`);
  console.log(`   ❌ Errors: ${errorCount}/150 psalms`);
  console.log(`   📁 Saved to: ${outputPath}`);
  console.log(`   📖 Total verses: ${psalms.reduce((total, psalm) => total + psalm.verses.length, 0)}`);
  
  if (errorCount > 0) {
    console.log(`\n⚠️ Note: ${errorCount} psalms had errors. You may want to:`);
    console.log(`   1. Check your ESV API key`);
    console.log(`   2. Verify your API quota`);
    console.log(`   3. Run the script again for failed psalms`);
  }
  
  console.log(`\n🚀 Your app now has complete ESV psalm text!`);
  console.log(`   Run 'npm run dev' to see the enhanced verses`);
}

// Check API key before starting
/*
if (ESV_API_KEY === 'YOUR_ESV_API_KEY_HERE') {
  console.error('❌ ESV API key not configured!');
  console.log('\n📝 To use this script:');
  console.log('1. Get an API key from https://api.esv.org/');
  console.log('2. Set environment variable: set ESV_API_KEY=your_key_here');
  console.log('3. Or edit this script to include your key directly');
  console.log('\n💡 Example: set ESV_API_KEY=abcd1234567890 && node scripts/populateEsvPsalms.js');
  process.exit(1);
}
*/

if (require.main === module) {
  populateAllPsalms().catch(console.error);
}

module.exports = { populateAllPsalms, fetchPsalmFromESV, parseEsvPassage };
