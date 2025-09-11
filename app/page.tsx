'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VerseCard from '@/components/VerseCard'
import Navigation from '@/components/Navigation'
import LikedVerses from '@/components/LikedVerses'
import FullPassageModal from '@/components/FullPassageModal'
import SettingsModal from '@/components/SettingsModal'
import { psalmsData } from '@/data/psalms'
import { Verse } from '@/types'
import { saveLikedVerses, loadLikedVerses, saveRecentlyShown, loadRecentlyShown, clearLikedVerses } from '@/lib/storage'

export default function Home() {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [likedVerses, setLikedVerses] = useState<Set<string>>(new Set())
  const [recentlyShown, setRecentlyShown] = useState<Set<string>>(new Set())
  const [currentTab, setCurrentTab] = useState<'discover' | 'liked'>('discover')
  const [showFullPassage, setShowFullPassage] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showingFullChapter, setShowingFullChapter] = useState(false)

  // Create a flat array of all verses for better randomization
  const allVerses = psalmsData.flatMap(psalm => 
    psalm.verses.map(verse => ({
      ...verse,
      psalmNumber: psalm.number,
      psalmTitle: psalm.title
    }))
  )

  useEffect(() => {
    // Load initial verse
    getRandomVerse()

    // Load persisted data from localStorage
    if (typeof window !== 'undefined') {
      setLikedVerses(loadLikedVerses())
      setRecentlyShown(loadRecentlyShown())
    }

    // Add keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault()
        getRandomVerse()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getRandomVerse = () => {
    setIsLoading(true)
    
    // Filter out recently shown verses to avoid repetition
    const availableVerses = allVerses.filter(verse => !recentlyShown.has(verse.id))
    
    // If we've shown too many verses, reset the recently shown list but keep some
    if (availableVerses.length < 5) {
      const versesToKeep = Array.from(recentlyShown).slice(-10) // Keep last 10
      const resetSet = new Set(versesToKeep)
      setRecentlyShown(resetSet)
      saveRecentlyShown(resetSet)
    }
    
    // Use crypto.getRandomValues for better randomness
    const getSecureRandom = () => {
      const array = new Uint32Array(1)
      crypto.getRandomValues(array)
      return array[0] / (0xffffffff + 1)
    }
    
    // Simulate loading for smooth transition
    setTimeout(() => {
      const versesToChooseFrom = availableVerses.length > 0 ? availableVerses : allVerses
      const randomIndex = Math.floor(getSecureRandom() * versesToChooseFrom.length)
      const selectedVerse = versesToChooseFrom[randomIndex]
      
      // Add to recently shown
      setRecentlyShown(prev => {
        const newSet = new Set(prev)
        newSet.add(selectedVerse.id)
        // Save to localStorage
        saveRecentlyShown(newSet)
        return newSet
      })
      
      setCurrentVerse(selectedVerse)
      setIsLoading(false)
    }, 300)
  }

  // Get liked verses as an array for the liked verses component
  const likedVersesArray = allVerses.filter(verse => likedVerses.has(verse.id))

  const handleLike = (verseId: string) => {
    setLikedVerses(prev => {
      const newSet = new Set(prev)
      if (newSet.has(verseId)) {
        newSet.delete(verseId)
      } else {
        newSet.add(verseId)
      }
      // Save to localStorage
      saveLikedVerses(newSet)
      return newSet
    })
  }

  const handleUnlike = (verseId: string) => {
    setLikedVerses(prev => {
      const newSet = new Set(prev)
      newSet.delete(verseId)
      // Save to localStorage
      saveLikedVerses(newSet)
      return newSet
    })
  }

  const handleReadFullPassage = (verse: Verse) => {
    setSelectedVerse(verse)
    setShowingFullChapter(false) // Start with popular verses first
    setShowFullPassage(true)
  }

  const handleReadFullChapter = () => {
    setShowingFullChapter(true)
  }

  const handleExportLikedVerses = () => {
    const likedVersesArray = Array.from(likedVerses)
    const dataStr = JSON.stringify(likedVersesArray, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'joyscroll-liked-verses.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportLikedVerses = (importedVerses: string[]) => {
    const currentArray = Array.from(likedVerses)
    const newLikedVerses = new Set([...currentArray, ...importedVerses])
    setLikedVerses(newLikedVerses)
    saveLikedVerses(newLikedVerses)
    setShowSettings(false)
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all your liked verses? This cannot be undone.')) {
      setLikedVerses(new Set())
      clearLikedVerses()
      setShowSettings(false)
    }
  }

  const handleNext = () => {
    getRandomVerse()
  }

  const handleContinueReading = () => {
    // Simply get a new random verse from any Psalm (this makes "Continue Reading" go to a different verse/Psalm)
    getRandomVerse()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navigation 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        likedCount={likedVerses.size}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      {currentTab === 'discover' ? (
        <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center"
              >
                <div className="glass-effect rounded-full p-8">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </motion.div>
            ) : currentVerse ? (
              <motion.div
                key={currentVerse.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="w-full max-w-md"
              >
                <VerseCard
                  verse={currentVerse}
                  isLiked={likedVerses.has(currentVerse.id)}
                  onLike={() => handleLike(currentVerse.id)}
                  onNext={handleNext}
                  onReadFullPassage={() => handleReadFullPassage(currentVerse)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
      ) : (
        <LikedVerses
          likedVerses={likedVersesArray}
          onBack={() => setCurrentTab('discover')}
          onUnlike={handleUnlike}
          onReadFullPassage={handleReadFullPassage}
        />
      )}

      {/* Full Passage Modal */}
      <FullPassageModal
        isOpen={showFullPassage}
        onClose={() => {
          setShowFullPassage(false)
          setShowingFullChapter(false) // Reset when closing
        }}
        onContinueReading={handleContinueReading}
        onReadFullChapter={handleReadFullChapter}
        psalmNumber={selectedVerse?.psalmNumber || 1}
        psalmTitle={selectedVerse?.psalmTitle || ''}
        currentVerseNumber={selectedVerse?.verseNumber}
        showingFullChapter={showingFullChapter}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        likedCount={likedVerses.size}
        recentlyShownCount={recentlyShown.size}
        onExport={handleExportLikedVerses}
        onImport={handleImportLikedVerses}
        onClearAll={handleClearAllData}
      />
    </div>
  )
}
