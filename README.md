# JoyScroll - Discover Psalms

A beautiful web application for discovering verses from the Psalms in a TikTok-like vertical scrolling interface with Instagram-style UI.

## Features

- 🎯 **Random Verse Discovery**: Get random verses from the Psalms
- 📱 **Mobile-First Design**: Optimized for mobile and responsive on all devices
- 💖 **Like System**: Save your favorite verses
- 📖 **Full Passage Reading**: Expand to read complete Psalms
- 🎨 **Beautiful UI**: Instagram-inspired design with smooth animations
- ⚡ **Fast Performance**: Built with Next.js and optimized for speed

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (sans-serif), Crimson Text (serif)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
joyscroll/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── VerseCard.tsx   # Main verse display card
│   ├── Navigation.tsx  # Top navigation
│   └── FullPassageModal.tsx # Modal for full Psalm reading
├── data/               # Static data
│   └── psalms.ts       # Psalms verses data
├── types/              # TypeScript type definitions
│   └── index.ts        # Global types
└── ...config files
```

## Features in Detail

### Verse Discovery
- Random verse selection from curated Psalms
- Smooth transitions between verses
- Beautiful typography optimized for reading

### Interactive Elements
- Like/heart verses to save favorites
- Share functionality
- Smooth animations and micro-interactions

### Full Passage Reading
- Modal interface to read complete Psalms
- Verse-by-verse navigation
- Clean, readable layout

## Design System

The app uses a custom design system built on Tailwind CSS:

- **Colors**: Primary blues and accent gold
- **Typography**: Inter for UI, Crimson Text for scripture
- **Glass morphism**: Subtle transparency and blur effects
- **Animations**: Smooth, purposeful motion

## Contributing

This is a personal project for spiritual enrichment. Feel free to fork and adapt for your own use.

## License

MIT License - feel free to use this code for your own projects.
