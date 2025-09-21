'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { Heart, ArrowDown, BookOpen, Share2, Volume2, VolumeX, Pause, Play, RotateCcw, Timer } from 'lucide-react'
import { VerseCardProps } from '@/types'
import SwipeIndicator from './SwipeIndicator'
import { shareVerse } from '@/lib/utils'
import { trackUnsplashDownload, getUnsplashAttribution } from '@/lib/unsplashCompliance'
import { PsalmImageManager, PsalmImageData } from '../lib/psalmImageManager'
import { textToSpeech } from '@/lib/textToSpeech'

export default function VerseCard({ verse, isLiked, onLike, onNext, onPrevious, onReadFullPassage, canGoBack = false }: VerseCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [psalmImage, setPsalmImage] = useState<PsalmImageData | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  
  // Text-to-speech state
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  
  // Autoscroll state
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false)
  const [autoScrollCountdown, setAutoScrollCountdown] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // TTS audio state (separate from autoscroll timing)
  const [audioEnabled, setAudioEnabled] = useState(false)
  
  // Autoscroll settings
  const AUTOSCROLL_DELAY = 5000 // 5 seconds delay after TTS completion or verse display
  
  // Calculate reading duration based on text length (words per minute)
  const calculateReadingDuration = (text: string): number => {
    const wordsPerMinute = 150 // Average reading speed
    const words = text.trim().split(/\s+/).length
    const readingTimeMinutes = words / wordsPerMinute
    const readingTimeMs = readingTimeMinutes * 60 * 1000
    // Add a minimum of 2 seconds and maximum of 15 seconds
    return Math.max(2000, Math.min(15000, readingTimeMs))
  }

  // Load autoscroll and audio preferences from localStorage on mount
  useEffect(() => {
    const savedAutoScroll = localStorage.getItem('joyscroll-autoscroll-enabled')
    const savedAudioEnabled = localStorage.getItem('joyscroll-audio-enabled')
    if (savedAutoScroll === 'true') {
      setAutoScrollEnabled(true)
    }
    if (savedAudioEnabled === 'true') {
      setAudioEnabled(true)
    }
    
    // Force British voice selection on component mount
    textToSpeech.forceBritishVoice()
  }, [])
  
  // Load psalm image dynamically
  useEffect(() => {
    if (verse.psalmNumber) {
      setImageLoading(true)
      setImageLoaded(false)
      
      // Check for cached image first
      const cachedImage = PsalmImageManager.getCachedImage(verse.psalmNumber)
      if (cachedImage) {
        setPsalmImage(cachedImage)
        setImageLoading(false)
        return
      }
      
      // Load image asynchronously
      PsalmImageManager.getPsalmImage(verse.psalmNumber)
        .then(image => {
          setPsalmImage(image)
          setImageLoading(false)
        })
        .catch(error => {
          console.error('Failed to load psalm image:', error)
          setImageLoading(false)
        })
    } else {
      setPsalmImage(null)
      setImageLoading(false)
    }
  }, [verse.psalmNumber, verse.text])

  // Check text-to-speech support
  useEffect(() => {
    setSpeechSupported(textToSpeech.isSupported())
  }, [])

  // Stop speech when verse changes
  useEffect(() => {
    return () => {
      textToSpeech.stop()
      setIsReading(false)
      setIsPaused(false)
      clearAutoScrollTimers()
    }
  }, [verse.id])

  // Autoscroll effect - start countdown when verse changes or TTS completes
  useEffect(() => {
    if (autoScrollEnabled && !isReading && !isDragging) {
      startAutoScrollCountdown()
    } else {
      clearAutoScrollTimers()
    }
    
    return clearAutoScrollTimers
  }, [autoScrollEnabled, isReading, isDragging, verse.id])

  // Clear autoscroll timers helper
  const clearAutoScrollTimers = () => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current)
      autoScrollTimeoutRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    setAutoScrollCountdown(0)
    setIsAutoScrolling(false)
  }

  // Start autoscroll countdown based on reading duration
  const startAutoScrollCountdown = () => {
    clearAutoScrollTimers()
    setIsAutoScrolling(true)
    
    // Calculate how long it would take to read this verse
    const readingDuration = calculateReadingDuration(verse.text)
    
    // If audio is enabled, handle TTS
    if (audioEnabled && speechSupported) {
      if (isReading) {
        // Audio is already playing - just wait for it to complete and advance
        console.log('Audio already playing - autoscroll will advance when TTS completes')
        // The autoscroll will be triggered after current TTS completes (handled in handleReadAloud)
        return
      } else {
        // Start new TTS
        console.log('Starting audio for autoscroll - TTS will handle advancing to next verse')
        handleReadAloud()
        // The autoscroll will be triggered after TTS completes (handled in handleReadAloud)
        return
      }
    }
    
    // If audio is off, wait for the calculated reading duration then advance
    console.log('Starting silent autoscroll countdown for', Math.ceil(readingDuration / 1000), 'seconds')
    setAutoScrollCountdown(Math.ceil(readingDuration / 1000)) // Convert to seconds for display
    
    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      setAutoScrollCountdown(prev => {
        if (prev <= 1) {
          clearAutoScrollTimers()
          onNext() // Auto advance to next verse
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Set main timeout
    autoScrollTimeoutRef.current = setTimeout(() => {
      clearAutoScrollTimers()
      onNext()
    }, readingDuration)
  }

  // Toggle autoscroll
  const toggleAutoScroll = () => {
    const newValue = !autoScrollEnabled
    setAutoScrollEnabled(newValue)
    
    // Save preference to localStorage
    localStorage.setItem('joyscroll-autoscroll-enabled', newValue.toString())
    
    if (autoScrollEnabled) {
      clearAutoScrollTimers() // Stop any active countdown when disabling
    }
  }

  // Toggle audio on/off (affects whether TTS plays, but timing stays the same)
  const toggleAudio = () => {
    const newValue = !audioEnabled
    console.log('toggleAudio called, changing from', audioEnabled, 'to', newValue)
    setAudioEnabled(newValue)
    
    // Save preference to localStorage
    localStorage.setItem('joyscroll-audio-enabled', newValue.toString())
    
    if (newValue) {
      // Enabling audio - debug voices and try to find better one
      textToSpeech.debugVoices()
      
      // If not currently reading, start reading this verse
      console.log('Enabling audio, isReading:', isReading, 'speechSupported:', speechSupported)
      if (!isReading && speechSupported) {
        console.log('Calling handleReadAloud from toggleAudio')
        handleReadAloud()
      }
    } else {
      // Disabling audio - stop current TTS if playing
      if (isReading) {
        console.log('Disabling audio and stopping TTS')
        textToSpeech.stop()
        setIsReading(false)
        setIsPaused(false)
        
        // If autoscroll was active, continue with silent countdown
        if (autoScrollEnabled && isAutoScrolling) {
          console.log('Continuing autoscroll in silent mode after stopping audio')
          // Calculate remaining time and continue with silent countdown
          const readingDuration = calculateReadingDuration(verse.text)
          setAutoScrollCountdown(Math.ceil(readingDuration / 1000))
          
          // Update countdown every second
          countdownIntervalRef.current = setInterval(() => {
            setAutoScrollCountdown(prev => {
              if (prev <= 1) {
                clearAutoScrollTimers()
                onNext()
                return 0
              }
              return prev - 1
            })
          }, 1000)

          // Set main timeout
          autoScrollTimeoutRef.current = setTimeout(() => {
            clearAutoScrollTimers()
            onNext()
          }, readingDuration)
        }
      }
    }
  }

  const cardVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { scale: 0.9, opacity: 0 }
  }

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  }

  const handleDrag = (event: any, info: PanInfo) => {
    const threshold = 50
    const maxProgress = 100
    
    if (Math.abs(info.offset.y) > 10) {
      const direction = info.offset.y < 0 ? 'up' : 'down'
      setSwipeDirection(direction)
      
      const progress = Math.min(Math.abs(info.offset.y) / maxProgress, 1)
      setSwipeProgress(progress)
    } else {
      setSwipeDirection(null)
      setSwipeProgress(0)
    }
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    setSwipeDirection(null)
    setSwipeProgress(0)
    
    const swipeThreshold = 50  // Reduced threshold for easier swiping
    const velocityThreshold = 300  // Reduced for more responsive swiping

    // Swipe up to go to next verse
    if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
      onNext()
    }
    // Swipe down to go back in history (if possible)
    else if (info.offset.y > swipeThreshold || info.velocity.y > velocityThreshold) {
      if (canGoBack) {
        onPrevious()
      } else {
        onNext() // Fallback to next if can't go back
      }
    }
  }

  const handleShare = () => {
    shareVerse(verse)
  }

  const handleImageClick = () => {
    if (psalmImage && psalmImage.source === 'unsplash') {
      // Track the download first (required)
      if (psalmImage.downloadLocation) {
        trackUnsplashDownload(psalmImage.downloadLocation)
      }
      // Open the photographer's profile on Unsplash
      window.open(psalmImage.photographerUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handlePhotographerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (psalmImage && psalmImage.source === 'unsplash') {
      // Track download and open photographer profile
      if (psalmImage.downloadLocation) {
        trackUnsplashDownload(psalmImage.downloadLocation)
      }
      window.open(psalmImage.photographerUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleUnsplashClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (psalmImage && psalmImage.source === 'unsplash') {
      // Open Unsplash homepage with UTM tracking
      window.open('https://unsplash.com/?utm_source=joyscroll&utm_medium=referral', '_blank', 'noopener,noreferrer')
    }
  }

  const handleReadAloud = async () => {
    console.log('=== handleReadAloud called ===')
    console.log('speechSupported:', speechSupported)
    console.log('audioEnabled:', audioEnabled)
    console.log('isReading:', isReading)
    console.log('isAutoScrolling:', isAutoScrolling)
    
    if (!speechSupported) {
      console.warn('Speech synthesis not supported')
      return
    }

    try {
      if (isReading && !isPaused) {
        // Stop reading
        console.log('Stopping TTS')
        textToSpeech.stop()
        setIsReading(false)
        setIsPaused(false)
        return
      } 
      
      if (isPaused) {
        // Resume reading
        console.log('Resuming TTS')
        textToSpeech.resume()
        setIsPaused(false)
        return
      }
      
      // Start reading
      console.log('Starting TTS for verse:', verse.psalmNumber + ':' + verse.verseNumber)
      setIsReading(true)
      setIsPaused(false)
      
      // Simple approach - just call the TTS and handle completion
      try {
        await textToSpeech.readVerse({
          text: verse.text,
          psalmNumber: verse.psalmNumber,
          verseNumber: verse.verseNumber
        })
        
        console.log('✅ TTS completed successfully')
        
        // Reading completed successfully
        setIsReading(false)
        setIsPaused(false)
        
        // If autoscroll is enabled, advance to next verse
        if (autoScrollEnabled && isAutoScrolling) {
          console.log('📱 Auto-advancing to next verse after TTS completion')
          clearAutoScrollTimers()
          onNext()
        }
        
      } catch (ttsError) {
        console.error('❌ TTS Error:', ttsError)
        setIsReading(false)
        setIsPaused(false)
        
        // Different error handling based on context
        if (isAutoScrolling) {
          console.log('🔄 TTS failed during autoscroll - continuing silently')
          // Continue autoscroll in silent mode
          const readingDuration = calculateReadingDuration(verse.text)
          setTimeout(() => {
            if (autoScrollEnabled && isAutoScrolling) {
              clearAutoScrollTimers()
              onNext()
            }
          }, readingDuration)
        } else {
          // Manual TTS - show error but don't crash
          console.log('⚠️ Manual TTS failed')
          // Don't show alert - just log the error
        }
      }
      
    } catch (outerError) {
      console.error('❌ Outer handleReadAloud error:', outerError)
      setIsReading(false)
      setIsPaused(false)
    }
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        drag="y"
        dragConstraints={{ top: -100, bottom: 100 }}
        dragElastic={0.3}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 0.98, rotateX: 2 }}
        className={`verse-card-reel mx-2 mt-4 mb-8 relative overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Background image */}
        {psalmImage && (
          <div className="absolute inset-0">
            <img
              src={psalmImage.url}
              alt={`Beautiful image for ${verse.psalmTitle || `Psalm ${verse.psalmNumber}`}`}
              className={`w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => {
                setImageLoaded(true)
                // Track Unsplash download for compliance
                if (psalmImage.source === 'unsplash' && psalmImage.downloadLocation) {
                  trackUnsplashDownload(psalmImage.downloadLocation)
                }
              }}
              onClick={handleImageClick}
              loading="lazy"
              title={psalmImage.source === 'unsplash' ? 'Click to view photographer on Unsplash' : undefined}
            />
            {/* Image overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Loading state */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-400/40 to-primary-600/60">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/70"></div>
              <p className="text-white/70 text-sm">Loading beautiful image...</p>
            </div>
          </div>
        )}
        
        {/* Fallback gradient when no image */}
        {!psalmImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 to-primary-600/60" />
        )}
        
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 pointer-events-none" />
        
        {/* Main content container - Instagram reel style */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4 pb-6 sm:p-6 sm:pb-8 min-h-0">
          {/* Top section - Psalm reference */}
          <motion.div 
            className="flex justify-between items-start flex-shrink-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="verse-reference text-white/90 drop-shadow-md text-lg font-semibold">
              Psalm {verse.psalmNumber}:{verse.verseNumber}
            </div>
            
            {/* Action buttons in top right */}
            <div className="flex space-x-2">
              {/* Audio toggle button */}
              {speechSupported && (
                <motion.button
                  variants={buttonVariants}
                  whileTap="tap"
                  onClick={toggleAudio}
                  className={`p-3 rounded-full backdrop-blur-sm border transition-colors flex-shrink-0 relative ${
                    audioEnabled 
                      ? 'bg-blue-500/90 border-blue-400/50 text-white' 
                      : 'bg-white/20 border-white/30 text-white hover:bg-blue-50/30 hover:border-blue-300/50'
                  }`}
                  title={audioEnabled ? 'Disable audio (silent reading mode)' : 'Enable audio (read aloud mode)'}
                >
                  {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  {/* Audio playing indicator */}
                  {isReading && audioEnabled && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.button>
              )}
              
              {/* Autoscroll toggle button */}
              <motion.button
                variants={buttonVariants}
                whileTap="tap"
                onClick={toggleAutoScroll}
                className={`p-3 rounded-full backdrop-blur-sm border transition-colors flex-shrink-0 relative ${
                  autoScrollEnabled 
                    ? 'bg-green-500/90 border-green-400/50 text-white' 
                    : 'bg-white/20 border-white/30 text-white hover:bg-green-50/30 hover:border-green-300/50'
                }`}
                title={autoScrollEnabled ? 'Disable autoscroll' : 'Enable autoscroll'}
              >
                <Timer size={20} />
                {/* Autoscroll countdown indicator */}
                {isAutoScrolling && autoScrollCountdown > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {autoScrollCountdown}
                  </motion.div>
                )}
              </motion.button>
              
              {/* Share button */}
              <motion.button
                variants={buttonVariants}
                whileTap="tap"
                onClick={handleShare}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors flex-shrink-0"
                title="Share this verse"
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Center section - Verse text */}
          <motion.div 
            className="flex-1 flex items-center justify-center px-2 sm:px-4 overflow-hidden min-h-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className="verse-text-container max-h-full overflow-y-auto w-full flex items-center justify-center scrollbar-hide relative"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ touchAction: 'pan-y' }}
            >
              <p className={`verse-text text-center text-xl sm:text-2xl md:text-3xl leading-relaxed text-white drop-shadow-lg font-light max-w-lg py-4 transition-all duration-300 ${
                isReading ? 'scale-105' : ''
              }`}>
                "{verse.text}"
              </p>
            </div>
          </motion.div>
          
          {/* Bottom section - Attribution and actions */}
          <div className="space-y-3 sm:space-y-4 flex-shrink-0">
            {/* Enhanced image attribution */}
            {psalmImage && (
              <motion.div 
                className="text-xs text-white/60 text-center drop-shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ delay: 0.8 }}
              >
                📸 {psalmImage.source === 'unsplash' ? (
                  <button 
                    onClick={handlePhotographerClick}
                    className="text-white/80 hover:text-white underline hover:no-underline transition-colors"
                    title="View photographer profile on Unsplash"
                  >
                    {psalmImage.photographer}
                  </button>
                ) : (
                  psalmImage.photographer
                )} • {psalmImage.source === 'unsplash' ? (
                  <button 
                    onClick={handleUnsplashClick}
                    className="text-white/80 hover:text-white underline hover:no-underline transition-colors"
                    title="Visit Unsplash"
                  >
                    Unsplash
                  </button>
                ) : (
                  psalmImage.source
                )}
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div 
              className="flex justify-center space-x-6 sm:space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Like button */}
              <motion.button
                variants={buttonVariants}
                whileTap="tap"
                whileHover="hover"
                onClick={onLike}
                className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  isLiked 
                    ? 'bg-red-500/90 text-white shadow-lg border border-red-400/50' 
                    : 'bg-white/20 hover:bg-red-50/30 text-white border border-white/30 hover:border-red-300/50'
                }`}
              >
                <Heart 
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${isLiked ? 'fill-current' : ''} drop-shadow-sm`}
                />
              </motion.button>

              {/* Read full passage button */}
              <motion.button
                variants={buttonVariants}
                whileTap="tap"
                whileHover="hover"
                onClick={onReadFullPassage}
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-blue-50/30 text-white border border-white/30 hover:border-blue-300/50 transition-all duration-300 backdrop-blur-sm"
              >
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm" />
              </motion.button>
            </motion.div>

            {/* Next verse indicator */}
            <motion.div 
              className="flex justify-center mt-4 sm:mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: isDragging ? 0.3 : 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="flex flex-col items-center text-white/80 text-center"
              >
                <div className="flex items-center space-x-4 mb-2">
                  {canGoBack && (
                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={{ y: [-2, 3, -2] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowDown className="w-4 h-4 rotate-180 drop-shadow-sm" />
                      </motion.div>
                      <span className="text-xs font-medium drop-shadow-sm">Back</span>
                    </div>
                  )}
                  
                  <motion.button
                    onClick={onNext}
                    className="flex flex-col items-center group"
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-sm mb-2 font-medium drop-shadow-sm">
                      {canGoBack ? 'Swipe up/down to navigate' : 'Swipe up for next verse'}
                    </span>
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowDown className="w-5 h-5 group-hover:text-white transition-colors drop-shadow-sm" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <SwipeIndicator direction={swipeDirection} progress={swipeProgress} />
    </>
  )
}
