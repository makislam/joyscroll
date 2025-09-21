// Free Text-to-Speech Manager with Natural Speech Patterns
export class TextToSpeechManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private voices: SpeechSynthesisVoice[] = []
  private bestBritishMaleVoice: SpeechSynthesisVoice | null = null

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.loadVoices()
      
      // Handle voice loading - some browsers load voices asynchronously
      if ('speechSynthesis' in window && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          this.loadVoices()
        }
      }
    }
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    
    this.voices = speechSynthesis.getVoices()
    this.bestBritishMaleVoice = this.findBestBritishMaleVoice()
  }

  private findBestBritishMaleVoice(): SpeechSynthesisVoice | null {
    // Priority order for finding the best British male voice with natural sound
    const voicePreferences = [
      // Microsoft Edge Neural voices (most natural sounding)
      (voice: SpeechSynthesisVoice) => 
        voice.name.includes('Microsoft') && voice.lang.includes('en-GB') && 
        (voice.name.includes('Ryan') || voice.name.includes('Thomas')),
      
      // Microsoft Edge other British male voices
      (voice: SpeechSynthesisVoice) => 
        voice.name.includes('Microsoft') && voice.lang.includes('en-GB') && 
        (voice.name.includes('George') || voice.name.includes('Ravi')),
      
      // Windows SAPI voices with "Neural" - these sound more natural
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('neural'),
      
      // Google UK voices tend to be higher quality
      (voice: SpeechSynthesisVoice) => 
        voice.name.includes('Google') && voice.lang.includes('en-GB'),
      
      // Look for specific natural-sounding British voice names
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB') && 
        (voice.name.includes('Daniel') || voice.name.includes('Oliver') || 
         voice.name.includes('Arthur') || voice.name.includes('James') ||
         voice.name.includes('William') || voice.name.includes('Charles') ||
         voice.name.includes('Hazel') || voice.name.includes('Susan')), // Some female voices can sound better
      
      // Prefer any voice explicitly marked as "male"
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('male'),
      
      // Any British voice (prefer over robotic US voices)
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB'),
      
      // UK voices without the hyphen
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en_GB') || voice.lang.toLowerCase().includes('british') || 
        voice.lang.toLowerCase().includes('uk'),
      
      // US English Neural/Premium voices as fallback (but make them sound more British)
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-US') && (voice.name.toLowerCase().includes('neural') || voice.name.toLowerCase().includes('premium')),
      
      // US English male voices as fallback
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-US') && voice.name.toLowerCase().includes('male'),
      
      // Any US English voice
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-US'),
      
      // Any English voice
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en')
    ]

    // Debug: Log all available voices
    console.log('Available voices:', this.voices.map(v => ({ name: v.name, lang: v.lang })))
    
    // Debug: Show British voices specifically
    const britishVoices = this.voices.filter(v => 
      v.lang.includes('en-GB') || v.lang.includes('en_GB') || 
      v.lang.toLowerCase().includes('british') || v.lang.toLowerCase().includes('uk')
    )
    console.log('British voices found:', britishVoices.map(v => ({ name: v.name, lang: v.lang })))

    for (const preference of voicePreferences) {
      const foundVoice = this.voices.find(preference)
      if (foundVoice) {
        console.log('Selected voice:', foundVoice.name, foundVoice.lang)
        return foundVoice
      }
    }

    // If no British voice found, log this and fallback to first available voice
    console.warn('No British voice found! Falling back to:', this.voices[0]?.name, this.voices[0]?.lang)

    // Fallback to first available voice
    return this.voices[0] || null
  }

  // Add natural pauses and improve speech flow
  private enhanceTextForNaturalSpeech(text: string): string {
    let enhancedText = text
    
    // Fix biblical text pronunciation issues first
    enhancedText = this.fixBiblicalPronunciation(enhancedText)
    
    // Add pauses only where punctuation marks exist
    
    // Add longer pauses after verse numbers (if they exist)
    enhancedText = enhancedText.replace(/(\d+)\s*/g, '$1... ')
    
    // Add pauses after commas for natural breathing
    enhancedText = enhancedText.replace(/,\s*/g, ', ... ')
    
    // Add longer pauses after periods for sentence breaks
    enhancedText = enhancedText.replace(/\.\s*/g, '. .... ')
    
    // Add pauses after semicolons for clause breaks
    enhancedText = enhancedText.replace(/;\s*/g, '; ... ')
    
    // Add pauses after colons for natural flow
    enhancedText = enhancedText.replace(/:\s*/g, ': ... ')
    
    // Add pauses after question marks and exclamation marks
    enhancedText = enhancedText.replace(/\?\s*/g, '? .... ')
    enhancedText = enhancedText.replace(/!\s*/g, '! .... ')
    
    // Add pauses around parenthetical expressions
    enhancedText = enhancedText.replace(/\(\s*/g, '... (')
    enhancedText = enhancedText.replace(/\s*\)/g, ') ... ')
    
    // Clean up excessive dots and normalize spacing
    enhancedText = enhancedText.replace(/\.{5,}/g, '....')
    enhancedText = enhancedText.replace(/\s+/g, ' ')
    enhancedText = enhancedText.trim()
    
    return enhancedText
  }

  // Fix biblical pronunciation issues
  private fixBiblicalPronunciation(text: string): string {
    let fixedText = text
    
    // Fix LORD (all caps) -> Lord (pronounced correctly)
    fixedText = fixedText.replace(/\bLORD\b/g, 'Lord')
    
    // Fix GOD (all caps) -> God
    fixedText = fixedText.replace(/\bGOD\b/g, 'God')
    
    // Fix other common biblical all-caps words
    fixedText = fixedText.replace(/\bGOD'S\b/g, "God's")
    fixedText = fixedText.replace(/\bLORD'S\b/g, "Lord's")
    
    // Fix biblical names that might be in all caps
    fixedText = fixedText.replace(/\bJESUS\b/g, 'Jesus')
    fixedText = fixedText.replace(/\bCHRIST\b/g, 'Christ')
    fixedText = fixedText.replace(/\bHOLY\b/g, 'Holy')
    fixedText = fixedText.replace(/\bSPIRIT\b/g, 'Spirit')
    
    // Fix possessive forms
    fixedText = fixedText.replace(/\bJESUS'\b/g, "Jesus'")
    fixedText = fixedText.replace(/\bCHRIST'S\b/g, "Christ's")
    
    // Fix other common biblical terms
    fixedText = fixedText.replace(/\bALMIGHTY\b/g, 'Almighty')
    fixedText = fixedText.replace(/\bSAVIOR\b/g, 'Savior')
    fixedText = fixedText.replace(/\bSAVIOUR\b/g, 'Saviour')
    
    // Fix book abbreviations that might be read incorrectly
    fixedText = fixedText.replace(/\bPS\b/g, 'Psalm')
    fixedText = fixedText.replace(/\bPSA\b/g, 'Psalm')
    fixedText = fixedText.replace(/\bMT\b/g, 'Matthew')
    fixedText = fixedText.replace(/\bMK\b/g, 'Mark')
    fixedText = fixedText.replace(/\bLK\b/g, 'Luke')
    fixedText = fixedText.replace(/\bJN\b/g, 'John')
    
    // Fix Hebrew terms that might be mispronounced
    fixedText = fixedText.replace(/\bYAHWEH\b/g, 'Yahweh')
    fixedText = fixedText.replace(/\bELOHIM\b/g, 'Elohim')
    fixedText = fixedText.replace(/\bADONAI\b/g, 'Adonai')
    
    // Fix common Hebrew words in psalms
    fixedText = fixedText.replace(/\bSELAH\b/g, 'Selah')
    fixedText = fixedText.replace(/\bHALLELUJAH\b/g, 'Hallelujah')
    fixedText = fixedText.replace(/\bHOSANNA\b/g, 'Hosanna')
    
    return fixedText
  }

  async speak(text: string, speedOrOptions: number | { rate?: number; pitch?: number; volume?: number } = 1.0): Promise<void> {
    console.log('🎤 TTS speak() called with text length:', text.length)
    console.log('🎤 Text preview:', text.substring(0, 50) + '...')
    
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser')
    }

    // Stop any current speech first
    if (speechSynthesis.speaking) {
      console.log('🛑 Stopping existing speech')
      speechSynthesis.cancel()
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Ensure voices are loaded
    if (this.voices.length === 0) {
      console.log('🔄 Loading voices')
      this.loadVoices()
    }

    // Extract speed and other options
    let speed = 0.8
    let pitch = 0.9
    let volume = 1.0

    if (typeof speedOrOptions === 'number') {
      speed = speedOrOptions
    } else if (typeof speedOrOptions === 'object') {
      speed = speedOrOptions.rate || 0.8
      pitch = speedOrOptions.pitch || 0.9
      volume = speedOrOptions.volume || 1.0
    }

    // Enhance text for natural speech patterns
    const enhancedText = this.enhanceTextForNaturalSpeech(text)
    console.log('🎵 Enhanced text preview:', enhancedText.substring(0, 50) + '...')

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(enhancedText)
        this.currentUtterance = utterance
        
        // Configure voice settings for natural, human-like speech
        utterance.rate = Math.min(Math.max(speed, 0.1), 10)
        utterance.pitch = pitch
        utterance.volume = volume

        // Use the best British male voice we found
        if (this.bestBritishMaleVoice) {
          utterance.voice = this.bestBritishMaleVoice
          console.log('🎭 Using voice:', this.bestBritishMaleVoice.name)
        } else {
          console.log('⚠️ No British voice selected, using default')
        }

        // Simple, reliable event handlers
        utterance.onstart = () => {
          console.log('🚀 TTS started')
        }

        utterance.onend = () => {
          console.log('✅ TTS ended normally')
          this.currentUtterance = null
          resolve()
        }
        
        utterance.onerror = (event) => {
          console.error('❌ TTS error event:', event.error, event)
          this.currentUtterance = null
          reject(new Error(`TTS error: ${event.error}`))
        }

        // Start speaking
        console.log('📢 Starting speechSynthesis.speak()')
        speechSynthesis.speak(utterance)
        
      } catch (error) {
        this.currentUtterance = null
        reject(error)
      }
    })
  }

  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    this.currentUtterance = null
  }

  // Compatibility methods for pause/resume (browser TTS doesn't support pause/resume)
  pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.pause()
    }
  }

  resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.resume()
    }
  }

  isPlaying(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && speechSynthesis.speaking
  }

  // Compatibility method for old interface
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  // Compatibility method for old interface
  isSpeaking(): boolean {
    return this.isPlaying()
  }

  // Compatibility method for old interface - now with natural speech enhancement
  async readVerse(verseData: { text: string; psalmNumber?: number; verseNumbers?: string; verseNumber?: string | number }): Promise<void> {
    // Use slower, more contemplative speed for verse reading with natural-sounding parameters
    await this.speak(verseData.text, { 
      rate: 0.75,  // Even slower for more natural, meditative reading
      pitch: 0.85, // Lower pitch for more natural male voice
      volume: 1.0 
    })
  }

  getVoiceType(): 'browser' | 'none' {
    return typeof window !== 'undefined' && 'speechSynthesis' in window ? 'browser' : 'none'
  }

  getSelectedVoice(): { name: string; lang: string } | null {
    if (!this.bestBritishMaleVoice) return null
    
    return {
      name: this.bestBritishMaleVoice.name,
      lang: this.bestBritishMaleVoice.lang
    }
  }

  getAllVoices(): Array<{ name: string; lang: string; default: boolean }> {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default
    }))
  }

  // Test natural speech patterns (for debugging)
  testNaturalSpeech(): void {
    const testText = "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures, and leads me beside still waters. \"Be still,\" he says!"
    console.log('Original:', testText)
    console.log('Fixed pronunciation:', this.fixBiblicalPronunciation(testText))
    console.log('Fully enhanced:', this.enhanceTextForNaturalSpeech(testText))
    
    if (this.isSupported()) {
      this.speak(testText, { rate: 0.8, pitch: 1.0, volume: 1.0 })
    }
  }

  // Test just the word "Lord" to check for unwanted pauses
  testLordPronunciation(): void {
    const testTexts = [
      "The Lord is my shepherd",
      "Praise the Lord",
      "Lord, hear my prayer", 
      "The Lord said to Moses"
    ]
    
    testTexts.forEach(text => {
      console.log('Original:', text)
      console.log('Fixed pronunciation:', this.fixBiblicalPronunciation(text))
      console.log('Fully enhanced:', this.enhanceTextForNaturalSpeech(text))
      console.log('---')
    })
  }

  // Force reload voices and reselect British voice
  forceReloadVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Force browser to reload voices
      speechSynthesis.getVoices()
      
      // Wait a bit for voices to load, then reload our selection
      setTimeout(() => {
        this.loadVoices()
        console.log('Voices reloaded. Selected voice:', this.getSelectedVoice())
        console.log('All British voices:', this.getBritishVoices())
      }, 100)
    }
  }

  // Force British voice selection - call this if you want to ensure British voice
  forceBritishVoice(): void {
    console.log('Forcing British voice selection...')
    this.forceReloadVoices()
    
    // After reload, try to manually select the best British voice
    setTimeout(() => {
      const britishVoices = this.getBritishVoices()
      if (britishVoices.length > 0) {
        // Try to find a male British voice first
        const maleVoice = this.voices.find(v => 
          (v.lang.includes('en-GB') || v.lang.includes('en_GB')) &&
          (v.name.toLowerCase().includes('male') || 
           v.name.includes('Daniel') || v.name.includes('Oliver') || 
           v.name.includes('Arthur') || v.name.includes('Harry') ||
           v.name.includes('James') || v.name.includes('William') ||
           v.name.includes('Ryan') || v.name.includes('Thomas') ||
           v.name.includes('George') || v.name.includes('Charles'))
        )
        
        if (maleVoice) {
          this.bestBritishMaleVoice = maleVoice
          console.log('Forced selection to British male voice:', maleVoice.name, maleVoice.lang)
        } else {
          // Any British voice is better than US
          this.bestBritishMaleVoice = this.voices.find(v => v.lang.includes('en-GB')) || null
          console.log('Forced selection to British voice:', this.bestBritishMaleVoice?.name, this.bestBritishMaleVoice?.lang)
        }
      } else {
        console.warn('No British voices available on this system')
      }
    }, 200)
  }

  // Manually set a specific voice by name
  setVoiceByName(voiceName: string): boolean {
    const voice = this.voices.find(v => v.name.includes(voiceName))
    if (voice) {
      this.bestBritishMaleVoice = voice
      console.log('Manually set voice to:', voice.name, voice.lang)
      return true
    }
    console.log('Voice not found:', voiceName)
    return false
  }

  // List all British voices available with quality ranking
  getBritishVoices(): Array<{ name: string; lang: string; quality: 'high' | 'medium' | 'low' }> {
    return this.voices
      .filter(voice => voice.lang.includes('en-GB') || voice.lang.includes('en_GB') || 
                      voice.lang.toLowerCase().includes('british') || 
                      voice.lang.toLowerCase().includes('uk'))
      .map(voice => {
        let quality: 'high' | 'medium' | 'low' = 'low'
        
        // High quality voices (Neural, Microsoft Edge, Google)
        if (voice.name.toLowerCase().includes('neural') || 
            voice.name.includes('Microsoft') || 
            voice.name.includes('Google')) {
          quality = 'high'
        }
        // Medium quality voices (system voices with good names)
        else if (voice.name.includes('Daniel') || voice.name.includes('Oliver') || 
                 voice.name.includes('Thomas') || voice.name.includes('Ryan') ||
                 voice.name.toLowerCase().includes('male')) {
          quality = 'medium'
        }
        
        return { name: voice.name, lang: voice.lang, quality }
      })
      .sort((a, b) => {
        // Sort by quality: high > medium > low
        const qualityOrder = { high: 3, medium: 2, low: 1 }
        return qualityOrder[b.quality] - qualityOrder[a.quality]
      })
  }

  // Test a specific voice by speaking a sample text
  async testVoice(voiceName: string): Promise<void> {
    const voice = this.voices.find(v => v.name === voiceName)
    if (voice) {
      const originalVoice = this.bestBritishMaleVoice
      this.bestBritishMaleVoice = voice
      
      try {
        await this.speak("The Lord is my shepherd, I shall not want.", { 
          rate: 0.75, 
          pitch: 0.85, 
          volume: 1.0 
        })
        console.log('Tested voice:', voiceName)
      } catch (error) {
        console.error('Error testing voice:', error)
      } finally {
        this.bestBritishMaleVoice = originalVoice
      }
    } else {
      console.log('Voice not found:', voiceName)
    }
  }
  // Simple test method for debugging
  async testSimple(): Promise<void> {
    console.log('🧪 Running simple TTS test')
    try {
      await this.speak("Hello, this is a test.", { rate: 0.8, pitch: 0.9, volume: 1.0 })
      console.log('✅ Simple test completed')
    } catch (error) {
      console.error('❌ Simple test failed:', error)
    }
  }

  // Debug method to show all available voices with quality assessment
  debugVoices(): void {
    console.log('=== VOICE DEBUG INFO ===')
    console.log('Total voices available:', this.voices.length)
    console.log('Currently selected voice:', this.getSelectedVoice())
    
    const britishVoices = this.getBritishVoices()
    console.log('British voices found:', britishVoices)
    
    const allVoices = this.voices.map(voice => {
      let quality = 'standard'
      if (voice.name.toLowerCase().includes('neural')) quality = 'neural'
      if (voice.name.includes('Microsoft')) quality = 'microsoft'
      if (voice.name.includes('Google')) quality = 'google'
      
      return {
        name: voice.name,
        lang: voice.lang,
        quality,
        isBritish: voice.lang.includes('en-GB') || voice.lang.includes('en_GB')
      }
    })
    
    console.log('All voices:', allVoices)
    console.log('High quality British voices:', 
      allVoices.filter(v => v.isBritish && (v.quality === 'neural' || v.quality === 'microsoft' || v.quality === 'google'))
    )
  }
}

// Create and export a singleton instance
export const textToSpeech = new TextToSpeechManager()
