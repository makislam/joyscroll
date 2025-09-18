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
    // Priority order for finding the best British male voice
    const voicePreferences = [
      // Microsoft Edge voices (high quality, free) - Neural voices sound most natural
      (voice: SpeechSynthesisVoice) => 
        voice.name.includes('Microsoft') && voice.lang.includes('en-GB') && 
        (voice.name.includes('Ryan') || voice.name.includes('Thomas') || voice.name.includes('George')),
      
      // Google UK English voices - Also very natural
      (voice: SpeechSynthesisVoice) => 
        voice.name.includes('Google') && voice.lang.includes('en-GB'),
      
      // Any British voice with "Neural" in the name (higher quality)
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('neural'),
      
      // Any British voice with "male" in the name
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('male'),
      
      // More aggressive British voice search - look for common British voice names
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB') && 
        (voice.name.includes('Daniel') || voice.name.includes('Oliver') || 
         voice.name.includes('Arthur') || voice.name.includes('Harry') ||
         voice.name.includes('James') || voice.name.includes('William')),
      
      // Any British voice at all
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

    for (const preference of voicePreferences) {
      const foundVoice = this.voices.find(preference)
      if (foundVoice) {
        console.log('Selected voice:', foundVoice.name, foundVoice.lang)
        return foundVoice
      }
    }

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
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser')
    }

    // Stop any current speech
    this.stop()

    // Ensure voices are loaded
    if (this.voices.length === 0) {
      this.loadVoices()
    }

    // Extract speed and other options - optimized for natural speech
    let speed = 0.9 // Slightly slower for more natural, contemplative reading
    let pitch = 1.0 // Natural pitch
    let volume = 1.0

    if (typeof speedOrOptions === 'number') {
      speed = speedOrOptions
    } else if (typeof speedOrOptions === 'object') {
      speed = speedOrOptions.rate || 0.9
      pitch = speedOrOptions.pitch || 1.0
      volume = speedOrOptions.volume || 1.0
    }

    // Enhance text for natural speech patterns
    const enhancedText = this.enhanceTextForNaturalSpeech(text)

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(enhancedText)
      this.currentUtterance = utterance
      
      // Configure voice settings for natural, human-like speech
      utterance.rate = Math.min(Math.max(speed, 0.1), 10)
      utterance.pitch = pitch
      utterance.volume = volume

      // Use the best British male voice we found
      if (this.bestBritishMaleVoice) {
        utterance.voice = this.bestBritishMaleVoice
      }

      utterance.onend = () => {
        this.currentUtterance = null
        resolve()
      }
      
      utterance.onerror = (event) => {
        this.currentUtterance = null
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      speechSynthesis.speak(utterance)
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
    // Use slower, more contemplative speed for verse reading
    await this.speak(verseData.text, { rate: 0.85, pitch: 1.0, volume: 1.0 })
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
      }, 100)
    }
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

  // List all British voices available
  getBritishVoices(): Array<{ name: string; lang: string }> {
    return this.voices
      .filter(voice => voice.lang.includes('en-GB') || voice.lang.includes('en_GB') || 
                      voice.lang.toLowerCase().includes('british') || 
                      voice.lang.toLowerCase().includes('uk'))
      .map(voice => ({ name: voice.name, lang: voice.lang }))
  }
}

// Create and export a singleton instance
export const textToSpeech = new TextToSpeechManager()
