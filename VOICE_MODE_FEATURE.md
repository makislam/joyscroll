# Voice Mode Feature Documentation

## Overview
Voice Mode creates a fully hands-free reading experience by automatically reading each verse aloud and then advancing to the next verse. This combines text-to-speech with autoscroll for continuous, uninterrupted psalm reading.

## Features

### 🎤 **Voice Mode Toggle**
- **Purple Mic button** in the top-right corner
- **Purple background** when enabled with animated pulse indicator
- **Persistent** across verses and browser sessions
- **Auto-enables autoscroll** when voice mode is activated

### 🔄 **Continuous Reading Cycle**
1. **Auto-starts TTS** when new verse loads (500ms delay for smooth transition)
2. **Reads verse aloud** using British male voice with natural pronunciation
3. **Immediately advances** to next verse after TTS completes (no countdown delay)
4. **Repeats cycle** seamlessly for uninterrupted reading experience

### 💾 **Smart State Management**
- **Independent controls**: Voice mode and autoscroll can be toggled separately
- **Auto-coordination**: Enabling voice mode automatically enables autoscroll
- **Persistent preferences**: Both settings saved to localStorage
- **Clean disabling**: Turning off voice mode stops current TTS

### 🎛️ **User Control Options**

#### Option 1: Voice Mode Only
- Click **Mic button** (purple) → Enables full voice mode
- Automatically enables autoscroll
- Continuously reads and advances

#### Option 2: Manual TTS + Autoscroll  
- Click **Timer button** (green) → Enables autoscroll only
- Use **Volume button** manually for each verse
- Auto-advances after TTS completes or 5-second delay

#### Option 3: Manual Everything
- Both buttons off (transparent)
- Manual TTS control with Volume button
- Manual navigation with swipe/tap

### 🔧 **Technical Implementation**

```typescript
// Voice mode state
const [voiceModeEnabled, setVoiceModeEnabled] = useState(false)

// Auto-start TTS when verse changes in voice mode
useEffect(() => {
  if (voiceModeEnabled && speechSupported && !isReading) {
    const autoTTSTimeout = setTimeout(() => {
      if (!isReading && !isDragging) {
        handleReadAloud()
      }
    }, 500) // Smooth transition delay
    
    return () => clearTimeout(autoTTSTimeout)
  }
}, [verse.id, voiceModeEnabled, speechSupported])

// Voice mode toggle with auto-enable autoscroll
const toggleVoiceMode = () => {
  const newValue = !voiceModeEnabled
  setVoiceModeEnabled(newValue)
  localStorage.setItem('joyscroll-voice-mode-enabled', newValue.toString())
  
  // Auto-enable autoscroll when enabling voice mode
  if (newValue && !autoScrollEnabled) {
    setAutoScrollEnabled(true)
    localStorage.setItem('joyscroll-autoscroll-enabled', 'true')
  }
}

// Smart autoscroll: immediate advance in voice mode, countdown in regular mode
const startAutoScrollCountdown = () => {
  if (voiceModeEnabled) {
    // Voice mode: immediate advance (100ms for smooth transition)
    autoScrollTimeoutRef.current = setTimeout(() => {
      onNext()
    }, 100)
  } else {
    // Regular mode: 5-second countdown with visual indicator
    setAutoScrollCountdown(5)
    // ... countdown logic
  }
}
```

### 🎯 **User Experience Flow**

#### **Starting Voice Mode:**
1. Click purple **Mic button**
2. Voice mode activates (purple background + pulse)
3. Autoscroll auto-enables (green Timer button)
4. Current verse starts reading aloud
5. After completion → immediately advances to next verse → starts reading → repeat seamlessly

#### **Stopping Voice Mode:**
1. Click purple **Mic button** again
2. Current TTS stops immediately
3. Autoscroll remains enabled (can disable separately)
4. Returns to manual control

### 📱 **UI Indicators**

- **Mic Button States:**
  - 🔲 Transparent: Voice mode off
  - 🟣 Purple + pulse: Voice mode active
  
- **Timer Button States:**
  - 🔲 Transparent: Autoscroll off  
  - 🟢 Green: Autoscroll on
  - 🔴 Red badge: Countdown active (5-4-3-2-1) - **only in regular autoscroll mode**
  - 🟢 Green (no badge): Voice mode active - **immediate advance, no countdown**

- **Volume Button States:**
  - 🔊 Volume2: Ready to read
  - 🔇 VolumeX: Currently reading (click to stop)
  - ▶️ Play: Paused (click to resume)

### 🙏 **Perfect for Meditation & Prayer**

Voice Mode is ideal for:
- **Morning devotions**: Hands-free scripture reading
- **Meditation sessions**: Continuous psalm flow
- **Prayer time**: Uninterrupted spiritual focus  
- **Bedtime reading**: Relaxing audio experience
- **Multitasking**: Listen while doing other activities

### ⚙️ **Configuration**

```typescript
const AUTOSCROLL_DELAY = 5000 // 5 seconds between verses
```

Easy to adjust timing by modifying the delay constant.

## Benefits

- ✅ **Completely hands-free** reading experience
- ✅ **Natural British voice** with biblical pronunciation
- ✅ **Persistent preferences** across sessions  
- ✅ **Flexible control** - voice mode, autoscroll, or manual
- ✅ **Smooth transitions** between verses
- ✅ **Pause-friendly** - respects user interactions
- ✅ **Perfect for meditation** and prayer time