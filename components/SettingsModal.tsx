'use client'

import { motion } from 'framer-motion'
import { X, Download, Upload, Trash2, BarChart3 } from 'lucide-react'
import { saveLikedVerses, clearLikedVerses } from '@/lib/storage'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  likedCount: number
  recentlyShownCount: number
  onImport: (verses: string[]) => void
  onExport: () => void
  onClearAll: () => void
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  likedCount, 
  recentlyShownCount,
  onImport,
  onExport,
  onClearAll
}: SettingsModalProps) {
  if (!isOpen) return null

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string
          const importedVerses = JSON.parse(result)
          if (Array.isArray(importedVerses)) {
            onImport(importedVerses)
          } else {
            alert('Invalid file format')
          }
        } catch (error) {
          alert('Error reading file')
        }
      }
      reader.readAsText(file)
    }
  }

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
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Settings & Stats</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary-600">{likedCount}</div>
                <div className="text-sm text-primary-700">Liked Verses</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-600">{recentlyShownCount}</div>
                <div className="text-sm text-slate-700">Recent Views</div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-3">Data Management</h3>
            <div className="space-y-3">
              {/* Export */}
              <button
                onClick={onExport}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
                disabled={likedCount === 0}
              >
                <Download className="w-4 h-4" />
                <span>Export Liked Verses</span>
              </button>

              {/* Import */}
              <label className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import Liked Verses</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>

              {/* Clear All */}
              <button
                onClick={onClearAll}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors"
                disabled={likedCount === 0}
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>

          {/* Storage Info */}
          <div className="text-xs text-slate-500 text-center">
            Your liked verses are saved locally in your browser and persist across sessions.
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
