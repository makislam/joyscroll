import { Psalm, Verse } from '@/types'

interface CompleteVerse extends Verse {
  psalmNumber: number
  psalmTitle: string
  isComplete: boolean
  quality: number // 1-5 rating for how complete/meaningful the verse is
}

/**
 * Determines if a verse text represents a complete thought
 */
function isCompleteThought(text: string): boolean {
  // Remove quotes and clean the text
  const cleanText = text.trim().replace(/^["']|["']$/g, '')
  
  // Check for sentence-ending punctuation
  const hasProperEnding = /[.!?]$/.test(cleanText)
  
  // Check for incomplete patterns (fragments that shouldn't stand alone)
  const incompletePatterns = [
    /^(but|and|or|for|yet|so)\s/i, // Starts with conjunction
    /^(who|which|that|when|where|while|if|unless|because|since|although)\s/i, // Starts with dependent clause
    /,\s*$/, // Ends with comma
    /^[a-z]/, // Starts with lowercase (likely continuation)
    /^\s*$/, // Empty or whitespace only
  ]
  
  // Check if text is too short to be meaningful
  const isTooShort = cleanText.split(' ').length < 3
  
  // Check for incomplete patterns
  const hasIncompletePattern = incompletePatterns.some(pattern => pattern.test(cleanText))
  
  return hasProperEnding && !hasIncompletePattern && !isTooShort
}

/**
 * Calculates a quality score for how meaningful and complete a verse is
 */
function calculateVerseQuality(verse: Verse): number {
  const text = verse.text.trim()
  let score = 0
  
  // Base score for complete thoughts
  if (isCompleteThought(text)) {
    score += 3
  }
  
  // Bonus for meaningful length (not too short, not too long)
  const wordCount = text.split(' ').length
  if (wordCount >= 5 && wordCount <= 25) {
    score += 1
  }
  
  // Bonus for inspirational/meaningful keywords
  const meaningfulKeywords = [
    'blessed', 'love', 'peace', 'joy', 'hope', 'faith', 'grace', 'mercy',
    'righteousness', 'salvation', 'strength', 'comfort', 'trust', 'refuge',
    'deliver', 'protect', 'guide', 'forgive', 'heal', 'restore', 'praise',
    'worship', 'glory', 'honor', 'thanksgiving', 'goodness', 'kindness',
    'faithful', 'eternal', 'everlasting', 'almighty', 'creator', 'redeemer'
  ]
  
  const textLower = text.toLowerCase()
  const meaningfulWordCount = meaningfulKeywords.filter(keyword => 
    textLower.includes(keyword)
  ).length
  
  if (meaningfulWordCount > 0) {
    score += Math.min(meaningfulWordCount, 2) // Max 2 bonus points
  }
  
  // Bonus for verses that form complete sentences
  if (/^[A-Z].*[.!?]$/.test(text.trim())) {
    score += 1
  }
  
  return Math.min(score, 5) // Cap at 5
}

/**
 * Combines consecutive verses if they form a more complete thought
 */
function combineRelatedVerses(psalm: Psalm): CompleteVerse[] {
  const combinedVerses: CompleteVerse[] = []
  const verses = psalm.verses
  
  for (let i = 0; i < verses.length; i++) {
    const currentVerse = verses[i]
    let combinedText = currentVerse.text.trim()
    let verseNumbers = [currentVerse.verseNumber]
    let combinedId = currentVerse.id
    
    // Look ahead to see if we should combine with next verses
    let j = i + 1
    while (j < verses.length && j < i + 3) { // Combine max 3 verses
      const nextVerse = verses[j]
      const potentialCombined = `${combinedText} ${nextVerse.text.trim()}`
      
      // Check if combining improves completeness
      const currentComplete = isCompleteThought(combinedText)
      const combinedComplete = isCompleteThought(potentialCombined)
      
      // Combine if current is incomplete but combined is complete
      // Or if both are incomplete but we're building toward completeness
      if ((!currentComplete && combinedComplete) || 
          (!currentComplete && !combinedComplete && potentialCombined.split(' ').length <= 30)) {
        combinedText = potentialCombined
        verseNumbers.push(nextVerse.verseNumber)
        combinedId = `${psalm.number}-${verseNumbers.join('-')}`
        j++
      } else {
        break
      }
    }
    
    // Create the combined verse
    const combinedVerse: CompleteVerse = {
      id: combinedId,
      text: combinedText,
      verseNumber: verseNumbers[0], // Use first verse number
      psalmNumber: psalm.number,
      psalmTitle: psalm.title,
      isComplete: isCompleteThought(combinedText),
      quality: calculateVerseQuality({ id: combinedId, text: combinedText, verseNumber: verseNumbers[0] })
    }
    
    combinedVerses.push(combinedVerse)
    
    // Skip the verses we combined
    i = j - 1
  }
  
  return combinedVerses
}

/**
 * Gets all high-quality, complete verses from all psalms
 */
export function getQualityVerses(psalmsData: Psalm[]): CompleteVerse[] {
  const allQualityVerses: CompleteVerse[] = []
  
  for (const psalm of psalmsData) {
    const combinedVerses = combineRelatedVerses(psalm)
    
    // Filter for high-quality verses
    const qualityVerses = combinedVerses.filter(verse => 
      verse.quality >= 3 && verse.isComplete
    )
    
    allQualityVerses.push(...qualityVerses)
  }
  
  return allQualityVerses
}

/**
 * Gets a weighted random selection favoring higher quality verses
 */
export function getWeightedRandomVerse(
  qualityVerses: CompleteVerse[], 
  recentlyShown: Set<string>
): CompleteVerse | null {
  // Filter out recently shown
  const availableVerses = qualityVerses.filter(verse => !recentlyShown.has(verse.id))
  
  if (availableVerses.length === 0) {
    // If all verses have been shown recently, reset but keep the most recent few
    const versesToKeep = Array.from(recentlyShown).slice(-10)
    const resetVerses = qualityVerses.filter(verse => !versesToKeep.includes(verse.id))
    return resetVerses.length > 0 ? getRandomFromWeighted(resetVerses) : getRandomFromWeighted(qualityVerses)
  }
  
  return getRandomFromWeighted(availableVerses)
}

/**
 * Selects a random verse weighted by quality score
 */
function getRandomFromWeighted(verses: CompleteVerse[]): CompleteVerse | null {
  if (verses.length === 0) return null
  
  // Create weighted array (higher quality = more chances to be selected)
  const weightedVerses: CompleteVerse[] = []
  
  for (const verse of verses) {
    // Add verse multiple times based on quality (quality 5 = 5 entries, etc.)
    for (let i = 0; i < verse.quality; i++) {
      weightedVerses.push(verse)
    }
  }
  
  // Use crypto for better randomness
  const getSecureRandom = () => {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / (0xffffffff + 1)
  }
  
  const randomIndex = Math.floor(getSecureRandom() * weightedVerses.length)
  return weightedVerses[randomIndex]
}