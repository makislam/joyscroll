'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ArrowLeft, BookOpen, Share2, Trash2 } from 'lucide-react'
import { Verse } from '@/types'
import { shareVerse } from '@/lib/utils'

interface LikedVersesProps {
  likedVerses: Verse[]
  onBack: () => void
  onUnlike: (verseId: string) => void
  onReadFullPassage: (verse: Verse) => void
}

export default function LikedVerses({ likedVerses, onBack, onUnlike, onReadFullPassage }: LikedVersesProps) {
  const handleShare = (verse: Verse) => {
    shareVerse(verse)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="glass-effect border-b border-white/20 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-800">Liked Verses</h1>
            <p className="text-sm text-slate-600">{likedVerses.length} saved</p>
          </div>
          
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {likedVerses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="mb-6">
              <Heart className="w-16 h-16 text-slate-300 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No liked verses yet</h2>
            <p className="text-slate-500">
              Start discovering verses and tap the heart to save your favorites here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {likedVerses.map((verse, index) => (
                <motion.div
                  key={verse.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="verse-card p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Verse text */}
                    <p className="verse-text mb-4 leading-relaxed">
                      "{verse.text}"
                    </p>
                    
                    {/* Verse reference */}
                    <div className="verse-reference mb-4">
                      Psalm {verse.psalmNumber}:{verse.verseNumber}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-3">
                        {/* Read full passage */}
                        <motion.button
                          onClick={() => onReadFullPassage(verse)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center w-10 h-10 rounded-full glass-effect hover:bg-primary-50 text-primary-600 transition-all duration-300"
                          title="Read full passage"
                        >
                          <BookOpen className="w-5 h-5" />
                        </motion.button>

                        {/* Share */}
                        <motion.button
                          onClick={() => handleShare(verse)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center w-10 h-10 rounded-full glass-effect hover:bg-green-50 text-green-600 transition-all duration-300"
                          title="Share verse"
                        >
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Unlike button */}
                      <motion.button
                        onClick={() => onUnlike(verse.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center w-10 h-10 rounded-full glass-effect hover:bg-red-50 text-red-500 transition-all duration-300"
                        title="Remove from liked"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
