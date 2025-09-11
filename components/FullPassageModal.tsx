'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { X, Heart, Share2 } from 'lucide-react'
import { psalmsData } from '@/data/psalms'

interface FullPassageModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueReading: () => void
  onReadFullChapter: () => void
  psalmNumber: number
  psalmTitle: string
  currentVerseNumber?: number
  showingFullChapter: boolean
}

export default function FullPassageModal({ 
  isOpen, 
  onClose, 
  onContinueReading, 
  onReadFullChapter, 
  psalmNumber, 
  psalmTitle, 
  currentVerseNumber, 
  showingFullChapter 
}: FullPassageModalProps) {
  const psalm = psalmsData.find(p => p.number === psalmNumber)
  const currentVerseRef = useRef<HTMLDivElement>(null)

  // Scroll to current verse when modal opens
  useEffect(() => {
    if (isOpen && currentVerseRef.current) {
      setTimeout(() => {
        currentVerseRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 300) // Delay to allow modal animation to complete
    }
  }, [isOpen, currentVerseNumber])

  if (!isOpen || !psalm) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Psalm {psalm.number}</h2>
            <p className="text-sm text-slate-600 mt-1">{psalm.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-slate-100 text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 text-green-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {(showingFullChapter ? psalm.verses : psalm.verses.slice(0, 3)).map((verse, index) => {
              const isCurrentVerse = currentVerseNumber === verse.verseNumber
              return (
                <motion.div
                  key={verse.id}
                  ref={isCurrentVerse ? currentVerseRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group p-3 rounded-xl transition-all duration-300 ${
                    isCurrentVerse 
                      ? 'bg-primary-50 border-2 border-primary-200 shadow-sm' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex">
                    <span className={`font-medium text-sm mr-3 mt-1 flex-shrink-0 ${
                      isCurrentVerse ? 'text-primary-600' : 'text-primary-500'
                    }`}>
                      {verse.verseNumber}
                    </span>
                    <p className={`verse-text leading-relaxed transition-colors ${
                      isCurrentVerse 
                        ? 'text-slate-800 font-medium' 
                        : 'text-slate-700 group-hover:text-slate-800'
                    }`}>
                      {verse.text}
                    </p>
                  </div>
                  {isCurrentVerse && (
                    <div className="mt-2 text-xs text-primary-600 font-medium">
                      ← You viewed this verse
                    </div>
                  )}
                </motion.div>
              )
            })}
            {!showingFullChapter && psalm.verses.length > 3 && (
              <div className="text-center text-slate-500 text-sm italic">
                + {psalm.verses.length - 3} more verses in this chapter
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {showingFullChapter ? `${psalm.verses.length} verses` : `Showing ${Math.min(3, psalm.verses.length)} of ${psalm.verses.length} verses`}
            </div>
            <div className="flex space-x-3">
              {!showingFullChapter && psalm.verses.length > 3 && (
                <button
                  onClick={onReadFullChapter}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 transition-colors font-medium"
                >
                  Read Full Chapter
                </button>
              )}
              <button
                onClick={() => {
                  onClose()
                  onContinueReading()
                }}
                className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium"
              >
                Continue Reading
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
