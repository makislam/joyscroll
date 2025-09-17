# Free Text-to-Speech Setup Guide

JoyScroll now uses **completely free** text-to-speech voices! No API keys required.

## How It Works

The app automatically selects the best free British male voice available on your device:

### 🎯 Voice Priority (Best to Fallback)
1. **Microsoft Edge voices** (Windows) - `Microsoft Ryan (English GB)` or `Microsoft Thomas (English GB)`
2. **Google UK English voices** (Chrome/Android)
3. **Any British male voice** available on your system
4. **Any British voice** available on your system
5. **US English male voices** as fallback
6. **Any English voice** as final fallback

## Browser Support

- ✅ **Chrome/Chromium** - Excellent voice selection
- ✅ **Microsoft Edge** - Best quality voices (Ryan/Thomas)
- ✅ **Firefox** - Good support with system voices
- ✅ **Safari** - Works with built-in voices
- ✅ **Mobile browsers** - Uses device's built-in voices

## Getting Better Voices

### Windows Users
- **Microsoft Edge** has the best free British male voices
- Voices are automatically installed with Windows 10/11
- For older Windows: Install speech packs via Settings > Time & Language > Speech

### Mac Users
- Built-in British voices: Daniel, Oliver
- Add more via System Preferences > Accessibility > Speech

### Android Users
- Google TTS has excellent British voices
- Install "Speech Services by Google" from Play Store
- Download British English voice packs

### iPhone/iPad Users
- Built-in British voices available
- Download via Settings > Accessibility > VoiceOver > Speech > Voice

## No Setup Required! 🎉

The app automatically:
- Detects available voices on your device
- Selects the best British male voice
- Falls back gracefully to other English voices
- Works immediately without any configuration

## Voice Quality Tips

1. **Use Microsoft Edge** for the best free voices
2. **Enable voice downloads** in your browser/OS settings
3. **Check voice settings** in your operating system for additional options
4. **Update your browser** for the latest voice improvements

## Debug Voice Selection

The app logs the selected voice to the browser console. Open Developer Tools (F12) and look for:
```
Selected voice: Microsoft Ryan - English (United Kingdom)
```

## Still Want Premium AI Voices?

If you want even higher quality voices, you can optionally add API keys to `.env.local`:
- OpenAI TTS (Alloy voice) - ~$0.015 per 1K characters
- ElevenLabs - Higher quality but more expensive
- Azure Cognitive Services - Good balance of quality and cost

But the free browser voices are excellent for most users! 🎵