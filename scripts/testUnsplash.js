// Simple test to debug Unsplash API authentication
const UNSPLASH_ACCESS_KEY = 'hVg9cilZ7J1F_xX7q4xUu19BIs14_btLPPoxJhuzqL4';

async function testUnsplashAuth() {
  try {
    console.log('Testing Unsplash API authentication...');
    
    const response = await fetch('https://api.unsplash.com/me', {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authentication successful!');
      console.log('Your Unsplash account:', data.username);
    } else {
      const errorText = await response.text();
      console.log('❌ Authentication failed');
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Network error:', error);
  }
}

testUnsplashAuth();
