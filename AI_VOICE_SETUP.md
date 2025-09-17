# British Male AI Voice Setup Guide

The JoyScroll app now features a high-quality British male AI voice for reading psalms. Here's how to set it up:

## Quick Setup (Choose One Option)

### Option 1: OpenAI TTS (Recommended - Easy & Affordable)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing
3. Get your API key from the API Keys section
4. Add to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```
**Cost**: ~$0.015 per 1000 characters (~$0.01 per psalm verse)

### Option 2: Azure Cognitive Services (Good Quality)
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a Speech Service resource
3. Get your key and region
4. Add to `.env.local`:
```
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=your_azure_region_here
```
**Cost**: ~$4 per 1 million characters

### Option 3: ElevenLabs (Highest Quality - Premium)
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Create an account
3. Get your API key
4. Add to `.env.local`:
```
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```
**Cost**: ~$0.30 per 1000 characters (premium pricing)

## Voice Selection Priority

The app will automatically try services in this order:
1. **ElevenLabs** (if API key provided) - Highest quality
2. **Azure** (if API key provided) - Good quality British neural voices
3. **OpenAI** (if API key provided) - Good quality, most affordable
4. **Browser fallback** - Uses device's built-in voices

## British Male Voices Used

- **ElevenLabs**: Antoni (professional British male narrator)
- **Azure**: Ryan Neural or Thomas Neural (British English)
- **OpenAI**: Alloy voice (closest to British male sound)

## No API Key? No Problem!

If you don't set up any API keys, the app will automatically fall back to your browser's built-in voices, which still work great for most users.

## Testing

1. Add your API key(s) to `.env.local`
2. Restart your development server: `npm run dev`
3. Click the volume button (🔊) on any verse
4. You should hear the high-quality British male AI voice!

## Troubleshooting

- **No sound**: Check if API keys are correct in `.env.local`
- **Robotic voice**: API might be failing, check browser console for errors
- **Slow loading**: First request might be slower as the AI generates audio

The AI voice will make your psalm reading experience much more engaging and natural! 🎤✨