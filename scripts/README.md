# Psalm Generation Scripts

This directory contains scripts to automatically generate all 150 Psalms for the JoyScroll app instead of manually hard-coding them.

## Available Scripts

### 1. `generatePsalms.js` - ESV API (Recommended)
Uses the official ESV API to fetch all Psalms with high-quality text.

**Requirements:**
- Get a free API key from [ESV API](https://api.esv.org/)
- Set your API key in the script

**Features:**
- Official ESV translation
- Complete verse coverage
- Accurate text parsing
- Handles all 150 Psalms

**Usage:**
```bash
# Edit generatePsalms.js and add your ESV API key
npm run generate-psalms
```

### 2. `generatePsalmsFree.js` - Free Bible API
Uses free Bible APIs that don't require API keys.

**Features:**
- No API key required
- Multiple translation options
- Good for testing and development

**Usage:**
```bash
npm run generate-psalms-free
```

### 3. `generateComprehensive.js` - Framework Template
Provides the complete structure and framework for generating all Psalms.

**Features:**
- Complete Psalm titles mapping
- Key verse selection logic
- Template for custom implementations

## How It Works

1. **Fetch Data**: Scripts connect to Bible APIs to retrieve Psalm text
2. **Parse Verses**: Extract individual verses with proper numbering
3. **Format Data**: Convert to TypeScript format matching your app's structure
4. **Generate File**: Write complete `psalms.ts` file with all 150 Psalms

## Generated Structure

Each script generates a file like this:

```typescript
import { Psalm } from '@/types'

export const psalmsData: Psalm[] = [
  {
    number: 1,
    title: "The Way of the Righteous and the Wicked",
    verses: [
      {
        id: "psalm-1-1",
        text: "Blessed is the man who walks not in the counsel of the wicked...",
        verseNumber: 1
      },
      // ... more verses
    ]
  },
  // ... all 150 Psalms
]
```

## Quick Start

1. **For best results (ESV API):**
   ```bash
   # Get API key from https://api.esv.org/
   # Edit scripts/generatePsalms.js and add your key
   npm run generate-psalms
   ```

2. **For immediate results (Free API):**
   ```bash
   npm run generate-psalms-free
   ```

## Benefits Over Manual Entry

- ✅ **Complete Coverage**: All 150 Psalms automatically
- ✅ **Accuracy**: Direct from official Bible sources
- ✅ **Consistency**: Uniform formatting and structure
- ✅ **Easy Updates**: Re-run script to update translations
- ✅ **Time Saving**: Generates 2000+ verses in minutes vs hours of manual work
- ✅ **Error Prevention**: Eliminates manual typing errors

## Translation Options

- **ESV**: English Standard Version (recommended for accuracy)
- **KJV**: King James Version (available via free API)
- **NIV**: New International Version (some APIs)
- **Custom**: Modify scripts for other translations

## Rate Limiting

Scripts include rate limiting to respect API terms:
- ESV API: 100ms delay between requests
- Free APIs: 200ms delay between requests

## File Output

Generated file replaces `data/psalms.ts` with complete Psalm database:
- **Before**: ~25 Psalms (manually entered)
- **After**: All 150 Psalms (automatically generated)
- **Verses**: 2000+ individual verses for discovery
- **Format**: Perfect TypeScript integration

## Troubleshooting

1. **API Key Issues**: Verify your ESV API key is correct
2. **Rate Limiting**: If you get errors, the script will retry with delays
3. **Network Issues**: Scripts handle connection errors gracefully
4. **File Permissions**: Ensure write permissions to `data/` directory

## Customization

You can modify the scripts to:
- Select different translations
- Choose specific Psalms
- Adjust verse selection criteria
- Modify output format
- Add additional metadata

This approach gives you the entire Book of Psalms with minimal effort!
