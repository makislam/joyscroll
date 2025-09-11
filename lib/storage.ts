// Utility functions for managing liked verses in localStorage

const LIKED_VERSES_KEY = 'joyscroll-liked-verses'

export function saveLikedVerses(likedVerses: Set<string>): void {
  try {
    const versesArray = Array.from(likedVerses)
    localStorage.setItem(LIKED_VERSES_KEY, JSON.stringify(versesArray))
  } catch (error) {
    console.warn('Failed to save liked verses to localStorage:', error)
  }
}

export function loadLikedVerses(): Set<string> {
  try {
    const stored = localStorage.getItem(LIKED_VERSES_KEY)
    if (stored) {
      const versesArray = JSON.parse(stored)
      return new Set(versesArray)
    }
  } catch (error) {
    console.warn('Failed to load liked verses from localStorage:', error)
  }
  return new Set()
}

export function clearLikedVerses(): void {
  try {
    localStorage.removeItem(LIKED_VERSES_KEY)
  } catch (error) {
    console.warn('Failed to clear liked verses from localStorage:', error)
  }
}

// Recently shown verses management
const RECENTLY_SHOWN_KEY = 'joyscroll-recently-shown'

export function saveRecentlyShown(recentlyShown: Set<string>): void {
  try {
    const versesArray = Array.from(recentlyShown)
    localStorage.setItem(RECENTLY_SHOWN_KEY, JSON.stringify(versesArray))
  } catch (error) {
    console.warn('Failed to save recently shown verses to localStorage:', error)
  }
}

export function loadRecentlyShown(): Set<string> {
  try {
    const stored = localStorage.getItem(RECENTLY_SHOWN_KEY)
    if (stored) {
      const versesArray = JSON.parse(stored)
      return new Set(versesArray)
    }
  } catch (error) {
    console.warn('Failed to load recently shown verses from localStorage:', error)
  }
  return new Set()
}
