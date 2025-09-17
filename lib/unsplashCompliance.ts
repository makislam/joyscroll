/**
 * Unsplash Compliance Helper
 * Implements Unsplash API guidelines for proper usage and attribution
 */

// Track download for Unsplash analytics (required by API terms)
export async function trackUnsplashDownload(downloadUrl: string) {
  if (!downloadUrl) return;
  
  try {
    console.log('🔥 Tracking Unsplash download:', downloadUrl);
    // This endpoint is required by Unsplash to track image usage
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('✅ Unsplash download tracked successfully:', response.status);
  } catch (error) {
    console.warn('❌ Failed to track Unsplash download:', error);
  }
}

// Get proper Unsplash attribution with required UTM parameters
export function getUnsplashAttribution(image: any, appName: string = 'JoyScroll') {
  if (!image || image.source !== 'Unsplash') return null;
  
  const utmParams = new URLSearchParams({
    utm_source: appName.toLowerCase(),
    utm_medium: 'referral',
    utm_campaign: 'api-credit'
  });
  
  // Use the photo ID to create a direct link to the photo instead of profile
  // This is more reliable than photographer profile URLs which can change
  const photoId = image.id || extractPhotoIdFromUrl(image.url);
  
  const attribution = {
    photoUrl: `https://unsplash.com/photos/${photoId}?${utmParams.toString()}`,
    photographerUrl: `${image.photographerUrl}?${utmParams.toString()}`,
    unsplashUrl: `https://unsplash.com/?${utmParams.toString()}`,
    photographerName: image.photographer,
    photoId: photoId
  };
  
  console.log('🔗 Generated Unsplash attribution URLs:', attribution);
  
  return attribution;
}

// Helper function to extract photo ID from Unsplash URL
function extractPhotoIdFromUrl(url: string): string {
  const match = url.match(/photo-(\w+)/);
  return match ? match[1] : '';
}

// Generate compliant attribution HTML
export function generateUnsplashAttributionHTML(image: any) {
  const attribution = getUnsplashAttribution(image);
  if (!attribution) return '';
  
  return `
    <div class="unsplash-attribution">
      Photo by 
      <a href="${attribution.photoUrl}" target="_blank" rel="noopener noreferrer">
        ${attribution.photographerName}
      </a> 
      on 
      <a href="${attribution.unsplashUrl}" target="_blank" rel="noopener noreferrer">
        Unsplash
      </a>
    </div>
  `;
}

// Generate compliant attribution text
export function generateUnsplashAttributionText(image: any) {
  if (!image || image.source !== 'Unsplash') return '';
  return `Photo by ${image.photographer} on Unsplash`;
}

// Hotlink compliance - redirect to original Unsplash photo
export function handleUnsplashImageClick(image: any) {
  if (!image || image.source !== 'Unsplash') return;
  
  const attribution = getUnsplashAttribution(image);
  if (attribution) {
    // Track the download first (required)
    if (image.downloadUrl) {
      trackUnsplashDownload(image.downloadUrl);
    }
    
    // Open the photo on Unsplash with proper attribution
    window.open(attribution.photoUrl, '_blank', 'noopener,noreferrer');
  }
}

// Add required Unsplash headers to image requests
export function getUnsplashImageUrl(baseUrl: string, width: number = 1080, quality: number = 80) {
  const url = new URL(baseUrl);
  
  // Add application identifier as required by Unsplash
  url.searchParams.set('utm_source', 'joyscroll');
  url.searchParams.set('utm_medium', 'referral');
  
  // Ensure proper sizing parameters
  url.searchParams.set('w', width.toString());
  url.searchParams.set('q', quality.toString());
  
  return url.toString();
}

export default {
  trackUnsplashDownload,
  getUnsplashAttribution,
  generateUnsplashAttributionHTML,
  generateUnsplashAttributionText,
  handleUnsplashImageClick,
  getUnsplashImageUrl
};
