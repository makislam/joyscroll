'use client'

import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface SwipeIndicatorProps {
  direction: 'up' | 'down' | null
  progress: number
}

export default function SwipeIndicator({ direction, progress }: SwipeIndicatorProps) {
  if (!direction) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
    >
      <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
        {direction === 'up' ? (
          <ArrowUp className="w-8 h-8 text-primary-600" />
        ) : (
          <ArrowDown className="w-8 h-8 text-primary-600" />
        )}
      </div>
      
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(59, 130, 246, 0.2)"
          strokeWidth="2"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={283}
          strokeDashoffset={283 - (progress * 283)}
          transition={{ duration: 0.1 }}
        />
      </svg>
    </motion.div>
  )
}
