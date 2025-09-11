'use client'

import { useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { Heart, ArrowDown, BookOpen, Share2 } from 'lucide-react'
import { VerseCardProps } from '@/types'
import SwipeIndicator from './SwipeIndicator'
import { shareVerse } from '@/lib/utils'

export default function VerseCard({ verse, isLiked, onLike, onNext, onReadFullPassage }: VerseCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null)
  const [swipeProgress, setSwipeProgress] = useState(0)

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
    // Optional: Swipe down to refresh/get random verse
    else if (info.offset.y > swipeThreshold || info.velocity.y > velocityThreshold) {
      onNext() // For now, both directions go to next verse
    }
  }

  const handleShare = () => {
    shareVerse(verse)
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
        whileDrag={{ scale: 0.95, rotateX: 5 }}
        className={`verse-card p-8 mx-4 my-8 relative overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        
        <div className="relative z-10">
          {/* Verse text */}
          <motion.p 
            className="verse-text mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            "{verse.text}"
          </motion.p>
          
          {/* Verse reference */}
          <motion.div 
            className="verse-reference mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Psalm {verse.psalmNumber}:{verse.verseNumber}
          </motion.div>

          {/* Action buttons */}
          <motion.div 
            className="flex justify-center space-x-6"
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
              className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'glass-effect hover:bg-red-50 text-red-500'
              }`}
            >
              <Heart 
                className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
              />
            </motion.button>

            {/* Read full passage button */}
            <motion.button
              variants={buttonVariants}
              whileTap="tap"
              whileHover="hover"
              onClick={onReadFullPassage}
              className="flex items-center justify-center w-14 h-14 rounded-full glass-effect hover:bg-primary-50 text-primary-600 transition-all duration-300"
            >
              <BookOpen className="w-6 h-6" />
            </motion.button>

            {/* Share button */}
            <motion.button
              variants={buttonVariants}
              whileTap="tap"
              whileHover="hover"
              onClick={handleShare}
              className="flex items-center justify-center w-14 h-14 rounded-full glass-effect hover:bg-green-50 text-green-600 transition-all duration-300"
            >
              <Share2 className="w-6 h-6" />
            </motion.button>
          </motion.div>

          {/* Next verse indicator */}
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: isDragging ? 0.3 : 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={onNext}
              className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors group"
              whileHover={{ y: -2 }}
            >
              <span className="text-sm mb-2 font-medium">Swipe up for next verse</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowDown className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <SwipeIndicator direction={swipeDirection} progress={swipeProgress} />
    </>
  )
}
