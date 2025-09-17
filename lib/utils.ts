import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function shareVerse(verse: { text: string; psalmNumber?: number; verseNumber: number }) {
  if (navigator.share) {
    navigator.share({
      title: `Psalm ${verse.psalmNumber}:${verse.verseNumber}`,
      text: `"${verse.text}" - Psalm ${verse.psalmNumber}:${verse.verseNumber}`,
      url: window.location.href,
    })
  } else {
    // Fallback for browsers that don't support Web Share API
    const text = `"${verse.text}" - Psalm ${verse.psalmNumber}:${verse.verseNumber}`
    navigator.clipboard.writeText(text)
    // You could show a toast notification here
  }
}

// Fullscreen API utilities
export function isFullscreenSupported(): boolean {
  return !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  )
}

export function isCurrentlyFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  )
}

export async function enterFullscreen(): Promise<void> {
  try {
    const element = document.documentElement
    
    if (element.requestFullscreen) {
      await element.requestFullscreen()
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen()
    } else if ((element as any).mozRequestFullScreen) {
      await (element as any).mozRequestFullScreen()
    } else if ((element as any).msRequestFullscreen) {
      await (element as any).msRequestFullscreen()
    }
    
    // Hide address bar on mobile by scrolling to top
    window.scrollTo(0, 1)
    setTimeout(() => window.scrollTo(0, 0), 100)
    
  } catch (error) {
    console.error('Error entering fullscreen:', error)
    throw error
  }
}

export async function exitFullscreen(): Promise<void> {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      await (document as any).webkitExitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      await (document as any).mozCancelFullScreen()
    } else if ((document as any).msExitFullscreen) {
      await (document as any).msExitFullscreen()
    }
  } catch (error) {
    console.error('Error exiting fullscreen:', error)
    throw error
  }
}

export async function toggleFullscreen(): Promise<void> {
  if (isCurrentlyFullscreen()) {
    await exitFullscreen()
  } else {
    await enterFullscreen()
  }
}
