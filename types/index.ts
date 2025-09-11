export interface Verse {
  id: string
  text: string
  verseNumber: number
  psalmNumber?: number
  psalmTitle?: string
}

export interface Psalm {
  number: number
  title: string
  verses: Verse[]
}

export interface VerseCardProps {
  verse: Verse
  isLiked: boolean
  onLike: () => void
  onNext: () => void
  onReadFullPassage?: () => void
}
