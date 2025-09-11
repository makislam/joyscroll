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
