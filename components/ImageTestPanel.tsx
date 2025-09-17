/**
 * Image Management Testing Component
 * For testing dynamic image loading and cache management
 */

'use client'

import { useState } from 'react'
import { PsalmImageManager } from '../lib/psalmImageManager'

export default function ImageTestPanel() {
  const [stats, setStats] = useState(PsalmImageManager.getStats())
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const updateStats = () => {
    setStats(PsalmImageManager.getStats())
  }

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSinglePsalm = async (psalmNumber: number) => {
    setIsLoading(true)
    addTestResult(`Testing Psalm ${psalmNumber}...`)
    
    try {
      const image = await PsalmImageManager.getPsalmImage(psalmNumber)
      if (image) {
        addTestResult(`✅ Got premium Unsplash image for Psalm ${psalmNumber} by ${image.photographer}`)
      } else {
        addTestResult(`❌ No image found for Psalm ${psalmNumber}`)
      }
    } catch (error) {
      addTestResult(`❌ Error loading Psalm ${psalmNumber}: ${error}`)
    }
    
    updateStats()
    setIsLoading(false)
  }

  const preloadPopularPsalms = async () => {
    setIsLoading(true)
    const popularPsalms = [1, 23, 27, 46, 91, 100, 121, 139, 150]
    addTestResult(`Preloading ${popularPsalms.length} popular psalms...`)
    
    try {
      await PsalmImageManager.preloadImages(popularPsalms)
      addTestResult(`✅ Preloading complete!`)
    } catch (error) {
      addTestResult(`❌ Preloading failed: ${error}`)
    }
    
    updateStats()
    setIsLoading(false)
  }

  const clearCache = () => {
    PsalmImageManager.clearCache()
    addTestResult('🗑️ Cache cleared')
    updateStats()
    setTestResults([])
  }

  const testApiConnection = async () => {
    setIsLoading(true)
    addTestResult('Testing our new static image database...')
    
    try {
      // Test a few random psalms
      const testPsalms = [1, 23, 91, 121, 150]
      let successCount = 0
      
      for (const psalmNum of testPsalms) {
        const image = await PsalmImageManager.getPsalmImage(psalmNum)
        if (image) {
          successCount++
        }
      }
      
      addTestResult(`✅ Database test complete! ${successCount}/${testPsalms.length} psalms have images`)
    } catch (error) {
      addTestResult(`❌ Database test failed: ${error}`)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🧪 Image System Test Panel</h3>
      
      {/* Cache Stats */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="font-semibold mb-1">Cache Stats:</div>
        <div>Cached: {stats.cached} | Total Available: {stats.totalAvailable}</div>
        <div>Coverage: {stats.coverage}</div>
      </div>

      {/* Test Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button 
          onClick={testApiConnection}
          disabled={isLoading}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
        >
          Test API
        </button>
        <button 
          onClick={() => testSinglePsalm(1)}
          disabled={isLoading}
          className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
        >
          Test Psalm 1
        </button>
        <button 
          onClick={preloadPopularPsalms}
          disabled={isLoading}
          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
        >
          Preload Popular
        </button>
        <button 
          onClick={clearCache}
          disabled={isLoading}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
        >
          Clear Cache
        </button>
      </div>

      {/* Test Results */}
      <div className="max-h-32 overflow-y-auto">
        <div className="font-semibold mb-1">Results:</div>
        {testResults.map((result, index) => (
          <div key={index} className="text-xs mb-1 opacity-80">
            {result}
          </div>
        ))}
        {isLoading && (
          <div className="text-yellow-300">⏳ Loading...</div>
        )}
      </div>
    </div>
  )
}