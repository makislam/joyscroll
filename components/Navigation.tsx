'use client'

import { motion } from 'framer-motion'
import { BookMarked, Heart, Home, Settings, Maximize, Minimize } from 'lucide-react'
import { useState, useEffect } from 'react'
import { isFullscreenSupported, isCurrentlyFullscreen, toggleFullscreen } from '@/lib/utils'

interface NavigationProps {
  currentTab: 'discover' | 'liked'
  onTabChange: (tab: 'discover' | 'liked') => void
  likedCount: number
  onSettingsClick: () => void
}

export default function Navigation({ currentTab, onTabChange, likedCount, onSettingsClick }: NavigationProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenSupported, setFullscreenSupported] = useState(false)

  useEffect(() => {
    // Check if fullscreen is supported
    setFullscreenSupported(isFullscreenSupported())
    
    // Check initial fullscreen state
    setIsFullscreen(isCurrentlyFullscreen())

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(isCurrentlyFullscreen())
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const handleFullscreenToggle = async () => {
    try {
      await toggleFullscreen()
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error)
    }
  }

  return (
    <motion.nav 
      className="glass-effect border-b border-white/20 p-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        {/* Logo Section - Hidden in fullscreen */}
        <motion.div 
          className="flex items-center justify-between mb-2 logo-section-hidden"
        >
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                JoyScroll
              </h1>
              <p className="text-xs text-slate-600">Discover Psalms</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Fullscreen Button - Only show if supported */}
            {fullscreenSupported && (
              <motion.button
                onClick={handleFullscreenToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full glass-effect text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </motion.button>
            )}

            {/* Settings Button */}
            <motion.button
              onClick={onSettingsClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full glass-effect text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation - Always visible, compact in fullscreen */}
        <div className={`flex items-center justify-center space-x-4 navigation-compact`}>
          <motion.button
            onClick={() => onTabChange('discover')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
              currentTab === 'discover'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'glass-effect text-slate-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Discover</span>
          </motion.button>

          <motion.button
            onClick={() => onTabChange('liked')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 relative ${
              currentTab === 'liked'
                ? 'bg-red-500 text-white shadow-lg'
                : 'glass-effect text-slate-600 hover:bg-red-50 hover:text-red-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`w-4 h-4 ${currentTab === 'liked' ? 'fill-current' : ''}`} />
            <span className="font-medium">Liked</span>
            {likedCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {likedCount > 99 ? '99+' : likedCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}
