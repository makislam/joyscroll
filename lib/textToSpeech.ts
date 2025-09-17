// Free Text-to-Speech Manager with British Male Voice Selection
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
      // Microsoft Edge voices (high quality, free)
      (voice: SpeechSynthesisVoice) => 
        voice.name.includes('Microsoft') && voice.lang.includes('en-GB') && 
        (voice.name.includes('Ryan') || voice.name.includes('Thomas')),
      
      // Google UK English voices
      (voice: SpeechSynthesisVoice) => 
        voice.name.includes('Google') && voice.lang.includes('en-GB'),
      
      // Any British voice with "male" in the name
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('male'),
      
      // Any British voice
      (voice: SpeechSynthesisVoice) => 
        voice.lang.includes('en-GB'),
      
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

  async speak(text: string, speedOrOptions: number | { rate?: number; pitch?: number; volume?: number } = 1.1): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser')
    }

    // Stop any current speech
    this.stop()

    // Ensure voices are loaded
    if (this.voices.length === 0) {
      this.loadVoices()
    }

    // Extract speed and other options
    let speed = 1.1
    let pitch = 0.9
    let volume = 1.0

    if (typeof speedOrOptions === 'number') {
      speed = speedOrOptions
    } else if (typeof speedOrOptions === 'object') {
      speed = speedOrOptions.rate || 1.1
      pitch = speedOrOptions.pitch || 0.9
      volume = speedOrOptions.volume || 1.0
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      this.currentUtterance = utterance
      
      // Configure voice settings for optimal quality
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

  // Compatibility method for old interface
  async readVerse(verseData: { text: string; psalmNumber?: number; verseNumbers?: string; verseNumber?: string | number }): Promise<void> {
    await this.speak(verseData.text)
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
}

// Create and export a singleton instance
export const textToSpeech = new TextToSpeechManager()
