/**
 * Script to generate all Psalms data from the ESV API
 * Run this script to populate psalms.ts with all 150 Psalms
 */

const fs = require('fs');
const path = require('path');

// ESV API configuration
const ESV_API_KEY = 'YOUR_ESV_API_KEY'; // You'll need to get this from https://api.esv.org/
const ESV_API_BASE = 'https://api.esv.org/v3/passage/text/';

// Psalm titles mapping (some Psalms don't have descriptive titles in the API)
const psalmTitles = {
  1: "The Way of the Righteous and the Wicked",
  2: "Why Do the Nations Rage?",
  3: "A Psalm of David When He Fled from Absalom",
  4: "Answer Me When I Call",
  5: "Lead Me in Your Righteousness",
  6: "O Lord, Rebuke Me Not",
  7: "In You Do I Take Refuge",
  8: "How Majestic Is Your Name",
  9: "I Will Recount Your Wonderful Deeds",
  10: "Why Do You Hide Yourself?",
  11: "The Lord Is in His Holy Temple",
  12: "Save, O Lord",
  13: "How Long, Lord?",
  14: "The Fool Says There Is No God",
  15: "Who Shall Dwell on Your Holy Hill?",
  16: "Keep Me Safe, My God",
  17: "In the Shadow of Your Wings",
  18: "The Lord is My Rock",
  19: "The Heavens Declare the Glory of God",
  20: "Trust in the Name of the Lord",
  21: "In Your Strength the King Rejoices",
  22: "My God, My God, Why Have You Forsaken Me?",
  23: "The Lord is My Shepherd",
  24: "The King of Glory",
  25: "To You, Lord, I Lift Up My Soul",
  26: "I Will Wash My Hands in Innocence",
  27: "The Lord is My Light and Salvation",
  28: "The Lord Is My Strength and Shield",
  29: "Ascribe to the Lord Glory",
  30: "Joy Comes with the Morning",
  31: "Into Your Hand I Commit My Spirit",
  32: "Blessed Is the One Whose Transgression Is Forgiven",
  33: "Shout for Joy in the Lord",
  34: "Taste and See That the Lord is Good",
  35: "Contend, O Lord, with Those Who Contend with Me",
  36: "How Precious Is Your Steadfast Love",
  37: "Trust in the Lord and Do Good",
  38: "O Lord, Rebuke Me Not in Your Anger",
  39: "I Said, I Will Guard My Ways",
  40: "I Waited Patiently for the Lord",
  41: "Blessed Is the One Who Considers the Poor",
  42: "As the Deer Pants for Streams of Water",
  43: "Send Out Your Light and Your Truth",
  44: "Come to Our Help",
  45: "My Heart Overflows with a Pleasing Theme",
  46: "God is Our Refuge and Strength",
  47: "Clap Your Hands, All Peoples",
  48: "Great Is the Lord",
  49: "Hear This, All Peoples",
  50: "The Mighty One, God the Lord",
  51: "Create in Me a Pure Heart",
  52: "Why Do You Boast of Evil?",
  53: "The Fool Says in His Heart",
  54: "Save Me, O God, by Your Name",
  55: "Cast Your Burden on the Lord",
  56: "In God I Trust",
  57: "Be Merciful to Me, O God",
  58: "Do You Indeed Decree What Is Right?",
  59: "Deliver Me from My Enemies",
  60: "O God, You Have Rejected Us",
  61: "Hear My Cry, O God",
  62: "Trust in God at All Times",
  63: "O God, You Are My God",
  64: "Hide Me from the Wicked",
  65: "Praise Is Due to You, O God",
  66: "Shout for Joy to God",
  67: "May God Be Gracious to Us",
  68: "God Shall Arise",
  69: "Save Me, O God",
  70: "Make Haste, O God, to Deliver Me",
  71: "In You, O Lord, Do I Take Refuge",
  72: "Give the King Your Justice",
  73: "Truly God Is Good to Israel",
  74: "O God, Why Do You Cast Us Off Forever?",
  75: "We Give Thanks to You, O God",
  76: "In Judah God Is Known",
  77: "I Cry Aloud to God",
  78: "Tell to the Coming Generation",
  79: "O God, the Nations Have Come",
  80: "Restore Us, O God",
  81: "Sing Aloud to God Our Strength",
  82: "God Has Taken His Place",
  83: "O God, Do Not Keep Silence",
  84: "How Lovely is Your Dwelling Place",
  85: "You Showed Favor to Your Land",
  86: "Incline Your Ear, O Lord",
  87: "On the Holy Mount Stands the City",
  88: "O Lord, God of My Salvation",
  89: "I Will Sing of the Steadfast Love of the Lord",
  90: "Our Dwelling Place",
  91: "My Refuge and My Fortress",
  92: "It Is Good to Give Thanks",
  93: "The Lord Reigns",
  94: "O Lord, God of Vengeance",
  95: "Oh Come, Let Us Sing to the Lord",
  96: "Sing to the Lord a New Song",
  97: "The Lord Reigns",
  98: "Sing to the Lord a New Song",
  99: "The Lord Reigns",
  100: "Shout for Joy to the Lord",
  101: "I Will Walk with Integrity",
  102: "Hear My Prayer, O Lord",
  103: "Praise the Lord, My Soul",
  104: "O Lord My God, You Are Very Great",
  105: "Give Thanks to the Lord",
  106: "Give Thanks to the Lord, for He Is Good",
  107: "Give Thanks to the Lord, for He Is Good",
  108: "My Heart Is Steadfast, O God",
  109: "Be Not Silent, O God of My Praise",
  110: "The Lord Says to My Lord",
  111: "I Will Give Thanks to the Lord",
  112: "Blessed Is the Man Who Fears the Lord",
  113: "Who Is Like the Lord Our God?",
  114: "When Israel Went Out from Egypt",
  115: "Not to Us, O Lord",
  116: "I Love the Lord",
  117: "Praise the Lord, All Nations",
  118: "His Steadfast Love Endures Forever",
  119: "Your Word is a Lamp to My Feet",
  120: "In My Distress I Called to the Lord",
  121: "My Help Comes from the Lord",
  122: "I Was Glad When They Said to Me",
  123: "To You I Lift Up My Eyes",
  124: "If It Had Not Been the Lord",
  125: "Those Who Trust in the Lord",
  126: "When the Lord Restored the Fortunes",
  127: "Unless the Lord Builds the House",
  128: "Blessed Is Everyone Who Fears the Lord",
  129: "Greatly Have They Afflicted Me",
  130: "Out of the Depths I Cry to You",
  131: "O Lord, My Heart Is Not Lifted Up",
  132: "Remember, O Lord, in David's Favor",
  133: "Behold, How Good and Pleasant",
  134: "Come, Bless the Lord",
  135: "Praise the Name of the Lord",
  136: "His Steadfast Love Endures Forever",
  137: "By the Waters of Babylon",
  138: "I Will Praise You with All My Heart",
  139: "You Have Searched Me and Known Me",
  140: "Deliver Me, O Lord, from Evil Men",
  141: "Let My Prayer Be Counted as Incense",
  142: "With My Voice I Cry Out to the Lord",
  143: "Hear My Prayer, O Lord",
  144: "Blessed Be the Lord, My Rock",
  145: "Great is the Lord",
  146: "Praise the Lord, O My Soul",
  147: "Praise the Lord",
  148: "Praise the Lord from the Heavens",
  149: "Praise the Lord",
  150: "Praise the Lord"
};

async function fetchPsalm(psalmNumber) {
  try {
    const response = await fetch(`${ESV_API_BASE}?q=Psalm+${psalmNumber}&format=plain&include-verse-numbers=true&include-footnotes=false&include-headings=false`, {
      headers: {
        'Authorization': `Token ${ESV_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.passages[0];
  } catch (error) {
    console.error(`Error fetching Psalm ${psalmNumber}:`, error);
    return null;
  }
}

function parseVerses(psalmText, psalmNumber) {
  // Remove the Psalm heading and split by verse numbers
  const cleanText = psalmText.replace(/^Psalm \d+\s*/, '').trim();
  const versePattern = /\[(\d+)\]\s*(.*?)(?=\[\d+\]|$)/gs;
  const verses = [];
  let match;

  while ((match = versePattern.exec(cleanText)) !== null) {
    const verseNumber = parseInt(match[1]);
    const text = match[2].trim().replace(/\s+/g, ' ');
    
    if (text) {
      verses.push({
        id: `psalm-${psalmNumber}-${verseNumber}`,
        text: text,
        verseNumber: verseNumber
      });
    }
  }

  return verses;
}

async function generateAllPsalms() {
  console.log('Generating all Psalms data...');
  const psalms = [];

  for (let i = 1; i <= 150; i++) {
    console.log(`Fetching Psalm ${i}...`);
    
    // Add delay to respect API rate limits
    if (i > 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const psalmText = await fetchPsalm(i);
    if (psalmText) {
      const verses = parseVerses(psalmText, i);
      if (verses.length > 0) {
        psalms.push({
          number: i,
          title: psalmTitles[i] || `Psalm ${i}`,
          verses: verses
        });
      }
    }
  }

  // Generate the TypeScript file content
  const fileContent = `import { Psalm } from '@/types'

export const psalmsData: Psalm[] = ${JSON.stringify(psalms, null, 2)
    .replace(/"([^"]+)":/g, '$1:')  // Remove quotes from object keys
    .replace(/"/g, '"')};  // Ensure proper quote formatting
`;

  // Write to file
  const outputPath = path.join(__dirname, '..', 'data', 'psalms.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf8');
  
  console.log(`Generated ${psalms.length} Psalms and saved to ${outputPath}`);
  console.log('Total verses:', psalms.reduce((sum, psalm) => sum + psalm.verses.length, 0));
}

// Run if called directly
if (require.main === module) {
  generateAllPsalms().catch(console.error);
}

module.exports = { generateAllPsalms, fetchPsalm, parseVerses };
