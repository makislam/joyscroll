/**
 * Test alternative free image APIs that work immediately
 */

// Picsum Photos - Random beautiful photos, no API key needed
async function testPicsumPhotos() {
  console.log('🖼️ Testing Picsum Photos (no API key needed)...');
  
  try {
    // Get info about a random landscape photo
    const response = await fetch('https://picsum.photos/1920/1080?random=1');
    
    if (response.ok) {
      console.log('✅ Picsum Photos works!');
      console.log('Random image URL:', response.url);
      return {
        url: response.url,
        urlSmall: 'https://picsum.photos/800/600?random=1',
        urlFull: 'https://picsum.photos/2400/1600?random=1',
        description: 'Beautiful nature scene',
        photographer: 'Picsum Collection',
        source: 'Picsum Photos'
      };
    }
  } catch (error) {
    console.error('Picsum Photos error:', error);
  }
  
  return null;
}

// JSONPlaceholder Photos - Free placeholder service
async function testJSONPlaceholder() {
  console.log('🖼️ Testing JSONPlaceholder...');
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos/1');
    
    if (response.ok) {
      const photo = await response.json();
      console.log('✅ JSONPlaceholder works!');
      console.log('Sample photo:', photo.title);
      return {
        url: photo.url,
        urlSmall: photo.thumbnailUrl,
        description: photo.title,
        photographer: 'JSONPlaceholder',
        source: 'JSONPlaceholder'
      };
    }
  } catch (error) {
    console.error('JSONPlaceholder error:', error);
  }
  
  return null;
}

async function testAllAlternatives() {
  console.log('Testing alternative image sources...\n');
  
  const picsum = await testPicsumPhotos();
  console.log('');
  
  const placeholder = await testJSONPlaceholder();
  console.log('');
  
  console.log('📋 Results Summary:');
  console.log('✓ Picsum Photos:', picsum ? 'Working' : 'Failed');
  console.log('✓ JSONPlaceholder:', placeholder ? 'Working' : 'Failed');
  
  if (picsum) {
    console.log('\n🎯 Recommended: Use Picsum Photos for now');
    console.log('   - No API key needed');
    console.log('   - High quality images');
    console.log('   - Perfect for development/testing');
  }
}

testAllAlternatives();
