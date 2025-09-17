/**
 * Bulk Unsplash Image Fetcher
 * Fetches high-quality images for all 150 psalms using the production API
 */

import { psalmThemes, fallbackTerms } from '../data/psalmThemes';

// Unsplash API types
interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    download_location: string;
  };
}

interface PsalmImageData {
  psalmNumber: number;
  imageUrl: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl: string;
  downloadLocation: string;
  attribution: string;
  searchTerms: string[];
  fetchedAt: string;
}

class BulkPsalmImageFetcher {
  private apiKey: string;
  private baseUrl = 'https://api.unsplash.com';
  private cache: Map<number, PsalmImageData> = new Map();
  private rateLimitDelay = 1000; // 1 second between requests
  private maxRetries = 3;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async searchPhotos(query: string): Promise<UnsplashPhoto | null> {
    const url = `${this.baseUrl}/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=portrait&order_by=relevant&content_filter=high`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${this.apiKey}`,
          'Accept-Version': 'v1'
        }
      });

      if (!response.ok) {
        console.error(`Search failed for "${query}": ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Select a random image from the first 10 results for variety
        const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
        return data.results[randomIndex];
      }
      
      return null;
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
      return null;
    }
  }

  private async fetchImageForPsalm(psalmNumber: number): Promise<PsalmImageData | null> {
    const themes = psalmThemes[psalmNumber] || fallbackTerms.slice(0, 4);
    
    console.log(`🎨 Fetching image for Psalm ${psalmNumber}...`);
    
    // Try each theme until we find a good image
    for (const theme of themes) {
      try {
        const photo = await this.searchPhotos(theme);
        
        if (photo) {
          const imageData: PsalmImageData = {
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
          return imageData;
        }
        
        // Rate limiting - wait between searches
        await this.sleep(this.rateLimitDelay);
        
      } catch (error) {
        console.error(`Error fetching image for Psalm ${psalmNumber} with theme "${theme}":`, error);
        await this.sleep(this.rateLimitDelay);
      }
    }
    
    console.warn(`❌ No image found for Psalm ${psalmNumber}`);
    return null;
  }

  private async triggerDownload(downloadLocation: string): Promise<void> {
    try {
      await fetch(downloadLocation, {
        headers: {
          'Authorization': `Client-ID ${this.apiKey}`
        }
      });
    } catch (error) {
      console.error('Error triggering download:', error);
    }
  }

  public async fetchAllPsalmImages(startPsalm = 1, endPsalm = 150): Promise<PsalmImageData[]> {
    const results: PsalmImageData[] = [];
    const failed: number[] = [];
    
    console.log(`🚀 Starting bulk fetch for Psalms ${startPsalm}-${endPsalm}`);
    console.log(`⏱️  Rate limit: ${this.rateLimitDelay}ms between requests`);
    
    for (let psalmNumber = startPsalm; psalmNumber <= endPsalm; psalmNumber++) {
      let retries = 0;
      let imageData: PsalmImageData | null = null;
      
      while (retries < this.maxRetries && !imageData) {
        if (retries > 0) {
          console.log(`🔄 Retrying Psalm ${psalmNumber} (attempt ${retries + 1}/${this.maxRetries})`);
          await this.sleep(this.rateLimitDelay * 2); // Longer delay on retry
        }
        
        imageData = await this.fetchImageForPsalm(psalmNumber);
        retries++;
      }
      
      if (imageData) {
        results.push(imageData);
        this.cache.set(psalmNumber, imageData);
        
        // Trigger download for compliance
        await this.triggerDownload(imageData.downloadLocation);
        
        // Progress update every 10 psalms
        if (psalmNumber % 10 === 0) {
          console.log(`📈 Progress: ${results.length}/${psalmNumber - startPsalm + 1} images fetched`);
        }
      } else {
        failed.push(psalmNumber);
        console.error(`💥 Failed to fetch image for Psalm ${psalmNumber} after ${this.maxRetries} retries`);
      }
      
      // Rate limiting between psalms
      await this.sleep(this.rateLimitDelay);
    }
    
    console.log(`\n🎉 Bulk fetch completed!`);
    console.log(`✅ Successfully fetched: ${results.length} images`);
    console.log(`❌ Failed to fetch: ${failed.length} images`);
    
    if (failed.length > 0) {
      console.log(`Failed psalms: ${failed.join(', ')}`);
    }
    
    return results;
  }

  public async generatePsalmImageFile(outputPath = '../data/unsplashPsalmImages.ts'): Promise<string> {
    console.log('🎯 Fetching images for all 150 psalms...');
    const imageData = await this.fetchAllPsalmImages();
    
    if (imageData.length === 0) {
      console.error('❌ No images were fetched. Cannot generate file.');
      throw new Error('No images were fetched');
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
    }, {} as Record<number, any>);
    
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
    
    // Write to file system (in a real environment, you'd use fs.writeFileSync)
    console.log('📝 Generated psalm images file:');
    console.log(`File path: ${outputPath}`);
    console.log(`Content length: ${fileContent.length} characters`);
    console.log('✅ File generation completed!');
    
    // Return the content for manual saving
    return fileContent;
  }
}

// Export for use in Node.js scripts
export default BulkPsalmImageFetcher;

// Usage example:
/*
const fetcher = new BulkPsalmImageFetcher('your-api-key');

// Fetch all 150 psalms
fetcher.fetchAllPsalmImages().then(results => {
  console.log(`Fetched ${results.length} psalm images`);
});

// Generate the complete data file
fetcher.generatePsalmImageFile('./data/unsplashPsalmImages.ts');

// Fetch a subset for testing
fetcher.fetchAllPsalmImages(1, 10).then(results => {
  console.log('Test batch completed:', results.length);
});
*/