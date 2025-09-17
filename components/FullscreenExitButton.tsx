'use client'

import { motion } from 'framer-motion'
import { Minimize } from 'lucide-react'
import { useState, useEffect } from 'react'
import { isCurrentlyFullscreen, exitFullscreen } from '@/lib/utils'

export default function FullscreenExitButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
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

  const handleExitFullscreen = async () => {
    try {
      await exitFullscreen()
    } catch (error) {
      console.error('Failed to exit fullscreen:', error)
    }
  }

  // Only render if in fullscreen mode
  if (!isFullscreen) return null

  return (
    <motion.button
      onClick={handleExitFullscreen}
      className="fixed z-[1000] bg-black bg-opacity-70 backdrop-blur-lg text-white border border-white border-opacity-20 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-opacity-90 hover:scale-110"
      style={{
        top: `max(20px, env(safe-area-inset-top, 20px))`,
        right: `max(20px, env(safe-area-inset-right, 20px))`
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title="Exit Fullscreen"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <Minimize className="w-5 h-5" />
    </motion.button>
  )
}