'use client'

import { useState, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { Heart, ArrowDown, BookOpen, Share2 } from 'lucide-react'
import { VerseCardProps } from '@/types'
import SwipeIndicator from './SwipeIndicator'
import { shareVerse } from '@/lib/utils'
import { trackUnsplashDownload, getUnsplashAttribution } from '@/lib/unsplashCompliance'
import { PsalmImageManager, PsalmImageData } from '../lib/psalmImageManager'

export default function VerseCard({ verse, isLiked, onLike, onNext, onPrevious, onReadFullPassage, canGoBack = false }: VerseCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [psalmImage, setPsalmImage] = useState<PsalmImageData | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  
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
        className={`verse-card-reel mx-2 my-4 relative overflow-hidden select-none ${
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
        <div className="relative z-10 h-full flex flex-col justify-between p-6">
          {/* Top section - Psalm reference */}
          <motion.div 
            className="flex justify-between items-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="verse-reference text-white/90 drop-shadow-md text-lg font-semibold">
              Psalm {verse.psalmNumber}:{verse.verseNumber}
            </div>
            
            {/* Share button in top right */}
            <motion.button
              variants={buttonVariants}
              whileTap="tap"
              onClick={handleShare}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
              title="Share this verse"
            >
              <Share2 size={20} />
            </motion.button>
          </motion.div>
          
          {/* Center section - Verse text */}
          <motion.div 
            className="flex-1 flex items-center justify-center px-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className="verse-text-container max-h-full overflow-y-auto w-full flex items-center justify-center scrollbar-hide"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ touchAction: 'pan-y' }}
            >
              <p className="verse-text text-center text-2xl md:text-3xl leading-relaxed text-white drop-shadow-lg font-light max-w-lg py-4">
                "{verse.text}"
              </p>
            </div>
          </motion.div>
          
          {/* Bottom section - Attribution and actions */}
          <div className="space-y-4">
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
              className="flex justify-center space-x-8"
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
                className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  isLiked 
                    ? 'bg-red-500/90 text-white shadow-lg border border-red-400/50' 
                    : 'bg-white/20 hover:bg-red-50/30 text-white border border-white/30 hover:border-red-300/50'
                }`}
              >
                <Heart 
                  className={`w-7 h-7 ${isLiked ? 'fill-current' : ''} drop-shadow-sm`}
                />
              </motion.button>

              {/* Read full passage button */}
              <motion.button
                variants={buttonVariants}
                whileTap="tap"
                whileHover="hover"
                onClick={onReadFullPassage}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 hover:bg-blue-50/30 text-white border border-white/30 hover:border-blue-300/50 transition-all duration-300 backdrop-blur-sm"
              >
                <BookOpen className="w-7 h-7 drop-shadow-sm" />
              </motion.button>
            </motion.div>

            {/* Next verse indicator */}
            <motion.div 
              className="flex justify-center mt-6"
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
