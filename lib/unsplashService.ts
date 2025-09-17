/**
 * Dynamic Unsplash Image Service
 * Fetches unique images for each psalm based on content and themes
 */

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    full: string;
  };
  links: {
    download_location: string;
    html: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  description: string | null;
  alt_description: string | null;
  likes: number;
  color: string;
  width: number;
  height: number;
}

export interface SearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

class UnsplashService {
  private accessKey: string;
  private baseUrl = 'https://api.unsplash.com';
  private cache = new Map<string, UnsplashPhoto>();

  constructor() {
    this.accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
    if (!this.accessKey) {
      console.warn('⚠️ Unsplash API key not configured');
    }
  }

  /**
   * Search for images based on query terms
   */
  async searchPhotos(query: string, page = 1, perPage = 10): Promise<SearchResponse> {
    if (!this.accessKey) {
      throw new Error('Unsplash API key not configured');
    }

    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString(),
      orientation: 'landscape',
      content_filter: 'high',
      order_by: 'relevant'
    });

    const response = await fetch(`${this.baseUrl}/search/photos?${params}`, {
      headers: {
        'Authorization': `Client-ID ${this.accessKey}`,
        'Accept-Version': 'v1'
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a specific photo by ID
   */
  async getPhoto(photoId: string): Promise<UnsplashPhoto> {
    if (!this.accessKey) {
      throw new Error('Unsplash API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/photos/${photoId}`, {
      headers: {
        'Authorization': `Client-ID ${this.accessKey}`,
        'Accept-Version': 'v1'
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Track photo download (required by Unsplash)
   */
  async trackDownload(downloadUrl: string): Promise<void> {
    if (!downloadUrl) return;

    try {
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
          'Accept-Version': 'v1'
        }
      });
      
      if (response.ok) {
        console.log('✅ Unsplash download tracked');
      }
    } catch (error) {
      console.warn('❌ Failed to track Unsplash download:', error);
    }
  }

  /**
   * Generate search terms based on psalm content and themes
   */
  generatePsalmSearchTerms(psalmNumber: number, psalmText?: string): string[] {
    // Predefined themes for specific well-known psalms
    const psalmThemes: Record<number, string[]> = {
      1: ['tree', 'water', 'streams', 'fruitful', 'flourishing'],
      8: ['stars', 'night sky', 'cosmos', 'heavens', 'majestic'],
      19: ['sunrise', 'golden light', 'heavens declare', 'morning'],
      23: ['green pasture', 'shepherd', 'peaceful meadow', 'still waters'],
      27: ['light', 'salvation', 'strength', 'brightness'],
      46: ['mountain', 'fortress', 'refuge', 'strong tower'],
      51: ['clean water', 'washing', 'pure', 'forgiveness'],
      91: ['eagle', 'wings', 'protection', 'shelter'],
      100: ['joy', 'celebration', 'flowers', 'praise'],
      103: ['blessing', 'abundance', 'flourishing', 'nature'],
      121: ['mountain', 'hills', 'help', 'sunrise'],
      139: ['intricate', 'detailed', 'fearfully made', 'creation'],
      150: ['celebration', 'colorful', 'vibrant', 'praise']
    };

    // Get predefined themes or generate from psalm content
    let searchTerms = psalmThemes[psalmNumber] || [];

    // Add general spiritual and nature terms
    const baseTerms = [
      'peaceful nature',
      'serene landscape', 
      'spiritual',
      'tranquil',
      'divine',
      'sacred'
    ];

    // Combine and return unique terms
    const allTerms = searchTerms.concat(baseTerms);
    return Array.from(new Set(allTerms));
  }

  /**
   * Get the best image for a specific psalm
   */
  async getPsalmImage(psalmNumber: number, psalmText?: string): Promise<UnsplashPhoto | null> {
    const cacheKey = `psalm-${psalmNumber}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const searchTerms = this.generatePsalmSearchTerms(psalmNumber, psalmText);
      
      // Try multiple search terms to find the best image
      for (const term of searchTerms) {
        const results = await this.searchPhotos(term, 1, 5);
        
        if (results.results.length > 0) {
          // Pick the first high-quality result
          const photo = results.results[0];
          
          // Cache the result
          this.cache.set(cacheKey, photo);
          
          console.log(`🖼️ Found image for Psalm ${psalmNumber}: "${term}" -> ${photo.id}`);
          return photo;
        }
      }

      console.warn(`⚠️ No images found for Psalm ${psalmNumber}`);
      return null;

    } catch (error) {
      console.error(`❌ Error fetching image for Psalm ${psalmNumber}:`, error);
      return null;
    }
  }

  /**
   * Preload images for multiple psalms
   */
  async preloadPsalmImages(psalmNumbers: number[]): Promise<Map<number, UnsplashPhoto>> {
    const results = new Map<number, UnsplashPhoto>();
    
    // Process in batches to respect rate limits
    const batchSize = 5;
    for (let i = 0; i < psalmNumbers.length; i += batchSize) {
      const batch = psalmNumbers.slice(i, i + batchSize);
      
      const promises = batch.map(async (psalmNumber) => {
        const image = await this.getPsalmImage(psalmNumber);
        if (image) {
          results.set(psalmNumber, image);
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < psalmNumbers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const unsplashService = new UnsplashService();
export default unsplashService;