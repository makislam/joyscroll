/**
 * Fetch Multiple Psalms in Batch
 * Fetch several psalms with delays to respect API rate limits
 */

const { fetchPsalmFromESV, parseEsvPassage } = require('./fetchSinglePsalm');
const fs = require('fs');
const path = require('path');

// Psalm titles (importing from the single psalm script would be better, but keeping it simple)
const psalmTitles = {
  1: "The Way of the Righteous and the Wicked",
  2: "Why Do the Nations Rage?",
  3: "A Psalm of David When He Fled from Absalom",
  4: "Answer Me When I Call",
  5: "Give Ear to My Words, O Lord",
  // ... (truncated for brevity - same as in fetchSinglePsalm.js)
  23: "The Lord Is My Shepherd",
  91: "He Who Dwells in the Shelter of the Most High",
  150: "Praise the Lord!"
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadExistingPsalms() {
  const psalmsPath = path.join(__dirname, '../data/psalms.ts');
  
  try {
    if (fs.existsSync(psalmsPath)) {
      const content = fs.readFileSync(psalmsPath, 'utf8');
      const jsonMatch = content.match(/export const psalmsData: Psalm\[\] = (\[[\s\S]*?\]);/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not load existing psalms, starting fresh');
  }
  
  return [];
}

async function saveUpdatedPsalms(psalms) {
  const outputPath = path.join(__dirname, '../data/psalms.ts');
  const output = `import { Psalm } from '@/types'

// Complete Psalms data - Updated on ${new Date().toISOString()}
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
`;

  fs.writeFileSync(outputPath, output, 'utf8');
}

async function fetchBatchPsalms() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Please provide psalm numbers to fetch');
    console.log('\n📖 Usage examples:');
    console.log('   node scripts/fetchBatchPsalms.js 1 2 3');
    console.log('   node scripts/fetchBatchPsalms.js 23 91 119');
    console.log('   node scripts/fetchBatchPsalms.js 1-10 (fetch psalms 1 through 10)');
    process.exit(1);
  }
  
  let psalmNumbers = [];
  
  // Parse arguments (support ranges like 1-10)
  for (const arg of args) {
    if (arg.includes('-')) {
      const [start, end] = arg.split('-').map(n => parseInt(n));
      if (start >= 1 && end <= 150 && start <= end) {
        for (let i = start; i <= end; i++) {
          psalmNumbers.push(i);
        }
      } else {
        console.error(`❌ Invalid range: ${arg}`);
        process.exit(1);
      }
    } else {
      const num = parseInt(arg);
      if (num >= 1 && num <= 150) {
        psalmNumbers.push(num);
      } else {
        console.error(`❌ Invalid psalm number: ${arg}`);
        process.exit(1);
      }
    }
  }
  
  // Remove duplicates and sort
  psalmNumbers = [...new Set(psalmNumbers)].sort((a, b) => a - b);
  
  console.log(`📚 Fetching ${psalmNumbers.length} psalms: ${psalmNumbers.join(', ')}`);
  console.log(`⏱️ This will take about ${Math.ceil(psalmNumbers.length * 0.5)} seconds with delays\n`);
  
  try {
    // Load existing psalms
    const existingPsalms = await loadExistingPsalms();
    console.log(`📖 Loaded ${existingPsalms.length} existing psalms`);
    
    let updated = 0;
    let added = 0;
    let errors = 0;
    
    for (let i = 0; i < psalmNumbers.length; i++) {
      const psalmNumber = psalmNumbers[i];
      
      console.log(`\n📖 [${i + 1}/${psalmNumbers.length}] Fetching Psalm ${psalmNumber}...`);
      
      try {
        // Check if psalm already exists
        const existingIndex = existingPsalms.findIndex(p => p.number === psalmNumber);
        const isUpdate = existingIndex !== -1;
        
        // Fetch psalm
        const rawPassage = await fetchPsalmFromESV(psalmNumber);
        
        if (!rawPassage) {
          console.error(`❌ Failed to fetch Psalm ${psalmNumber}`);
          errors++;
          continue;
        }
        
        const verses = parseEsvPassage(rawPassage, psalmNumber);
        
        if (!verses || verses.length === 0) {
          console.error(`❌ Failed to parse verses for Psalm ${psalmNumber}`);
          errors++;
          continue;
        }
        
        const newPsalm = {
          number: psalmNumber,
          title: psalmTitles[psalmNumber] || `Psalm ${psalmNumber}`,
          verses: verses
        };
        
        // Update or add the psalm
        if (isUpdate) {
          existingPsalms[existingIndex] = newPsalm;
          updated++;
          console.log(`✅ Updated Psalm ${psalmNumber}: ${verses.length} verses`);
        } else {
          existingPsalms.push(newPsalm);
          added++;
          console.log(`✅ Added Psalm ${psalmNumber}: ${verses.length} verses`);
        }
        
        // Add delay between requests (500ms)
        if (i < psalmNumbers.length - 1) {
          await sleep(500);
        }
        
      } catch (error) {
        console.error(`💥 Error with Psalm ${psalmNumber}:`, error.message);
        errors++;
      }
    }
    
    // Sort by psalm number
    existingPsalms.sort((a, b) => a.number - b.number);
    
    // Save updated psalms
    await saveUpdatedPsalms(existingPsalms);
    
    console.log(`\n🎉 Batch fetch complete!`);
    console.log(`📊 Results:`);
    console.log(`   ✅ Added: ${added} psalms`);
    console.log(`   🔄 Updated: ${updated} psalms`);
    console.log(`   ❌ Errors: ${errors} psalms`);
    console.log(`   📚 Total: ${existingPsalms.length}/150 psalms`);
    
    if (errors === 0) {
      console.log(`\n🚀 All requests successful! Your app now has authentic ESV text.`);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  fetchBatchPsalms().catch(console.error);
}

module.exports = { fetchBatchPsalms };
