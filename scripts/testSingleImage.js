// Minimal Unsplash test - just one request
const UNSPLASH_ACCESS_KEY = 'hVg9cilZ7J1F_xX7q4xUu19BIs14_btLPPoxJhuzqL4';

async function testSingleImage() {
  try {
    console.log('Testing single image fetch...');
    
    // Try the simplest possible request - search for "nature"
    const url = `https://api.unsplash.com/search/photos?query=nature&per_page=1`;
    
    console.log('Request URL:', url);
    console.log('Access Key (first 10 chars):', UNSPLASH_ACCESS_KEY.substring(0, 10) + '...');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Found images:', data.total);
      
      if (data.results && data.results.length > 0) {
        const image = data.results[0];
        console.log('First image:');
        console.log('  ID:', image.id);
        console.log('  Description:', image.alt_description);
        console.log('  Photographer:', image.user.name);
        console.log('  URL:', image.urls.small);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Network error:', error);
  }
}

testSingleImage();
