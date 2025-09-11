/**
 * Test ESV API Connection
 * Quick test to verify API key and connection before running full population
 */

const ESV_API_KEY = process.env.ESV_API_KEY || 'f6b6949443e6071c10515ce8c8bcce519d579600';
const ESV_API_BASE = 'https://api.esv.org/v3/passage/text/';

async function testEsvApi() {
  console.log('🔍 Testing ESV API connection...');
  console.log(`🔑 API Key: ${ESV_API_KEY.substring(0, 8)}...`);
  
  // Skip the API key check since we have it hardcoded for testing
  /*
  if (ESV_API_KEY === 'YOUR_ESV_API_KEY_HERE') {
    console.error('❌ Please set your ESV API key first!');
    console.log('\n📝 Steps to get started:');
    console.log('1. Visit: https://api.esv.org/');
    console.log('2. Create free account and get API key');
    console.log('3. Set environment variable:');
    console.log('   set ESV_API_KEY=your_key_here');
    console.log('4. Run this test again');
    return;
  }
  */
  
  try {
    // Test with a short psalm (Psalm 117 - shortest psalm)
    const query = 'Psalm 117';
    const url = `${ESV_API_BASE}?q=${encodeURIComponent(query)}&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=false`;
    
    console.log(`🌐 Testing with: ${query}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${ESV_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      if (response.status === 401) {
        console.log('\n💡 This looks like an authentication error.');
        console.log('   Check that your API key is correct.');
      } else if (response.status === 429) {
        console.log('\n💡 Rate limit exceeded. Wait a moment and try again.');
      }
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ API connection successful!');
    console.log(`📖 Query: ${data.query}`);
    console.log(`📝 Canonical: ${data.canonical}`);
    
    if (data.passages && data.passages.length > 0) {
      console.log(`📜 Sample text: ${data.passages[0].substring(0, 200)}...`);
      
      // Test parsing
      const verseRegex = /\[(\d+)\]\s*([^[\n]+)/g;
      const verses = [];
      let match;
      
      while ((match = verseRegex.exec(data.passages[0])) !== null) {
        verses.push({
          verse: parseInt(match[1]),
          text: match[2].trim().replace(/\s*\(ESV\)\s*$/, '')
        });
      }
      
      console.log(`🔢 Parsed ${verses.length} verses:`);
      verses.forEach(v => {
        console.log(`   ${v.verse}: ${v.text.substring(0, 60)}...`);
      });
      
      console.log('\n🎉 Everything looks good!');
      console.log('📚 Ready to populate all 150 psalms:');
      console.log('   npm run populate-esv-psalms');
      
    } else {
      console.error('❌ No passages returned');
    }
    
  } catch (error) {
    console.error('💥 Connection error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check your internet connection');
    console.log('   - Verify your API key');
    console.log('   - Make sure you have fetch available (Node.js 18+)');
  }
}

if (require.main === module) {
  testEsvApi().catch(console.error);
}

module.exports = { testEsvApi };
