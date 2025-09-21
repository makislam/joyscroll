# Autos### 1. **Persistent Toggle Control**
- Timer icon button in the top-right corner (green when enabled)
- Green background when enabled, transparent when disabled
- **Stays enabled across verse changes and browser sessions**
- Stored in localStorage for persistence
- Click to toggle autoscroll on/off
- **Works with Voice Mode**: See Voice Mode feature for automatic TTS + autoscrollFeature Documentation

## Overview
The autoscroll feature automatically advances to the next verse after a configurable delay. It works independently of the read-aloud feature and **persists across verses and browser sessions** until manually disabled.

## Features

### 1. **Persistent Toggle Control**
- New Timer icon button in the top-right corner
- Green background when enabled, transparent when disabled
- **Stays enabled across verse changes and browser restarts**
- Stored in localStorage for persistence
- Click to toggle autoscroll on/off

### 2. **Smart Triggering**
- **With TTS**: Starts countdown after text-to-speech completes
- **Without TTS**: Starts countdown immediately when verse loads
- **Delay**: 5 seconds (configurable via `AUTOSCROLL_DELAY` constant)

### 3. **Visual Feedback**
- Countdown timer badge (5, 4, 3, 2, 1) appears on the Timer button
- Red circular badge shows remaining seconds
- Smooth animations for appearance/disappearance

### 4. **User Interaction Handling**
- **Pauses during dragging**: Countdown stops when user swipes
- **Pauses during TTS**: No autoscroll while reading aloud
- **Resumes automatically**: Countdown restarts when conditions are met

### 5. **Smart Cleanup & Persistence**
- Automatically clears timers when verse changes
- **Remembers user preference**: Autoscroll setting persists across:
  - Verse navigation
  - Page reloads
  - Browser restarts
  - New sessions
- Prevents memory leaks with proper cleanup
- Handles edge cases gracefully

## Usage

### **Standard Autoscroll Mode:**
1. **Enable Autoscroll**: Click the Timer button (turns green and **stays enabled**)
2. **Read or View**: Either use read-aloud manually or just view the verse
3. **Countdown**: Watch the 5-second countdown on the Timer button
4. **Auto-advance**: Automatically moves to next verse
5. **Persistent**: Autoscroll **remains active** across verse changes
6. **Disable**: Click Timer button again to turn off (preference saved)

### **Voice Mode (Recommended for Hands-Free):**
1. **Enable Voice Mode**: Click the Mic button (turns purple) - auto-enables autoscroll
2. **Automatic Reading**: Each verse reads aloud automatically
3. **Continuous Flow**: Auto-advances and reads next verse
4. **Hands-Free**: Perfect for meditation and prayer sessions

See `VOICE_MODE_FEATURE.md` for complete voice mode documentation.

## Technical Implementation

### Persistent State Management
```typescript
// Load from localStorage on component mount
useEffect(() => {
  const savedAutoScroll = localStorage.getItem('joyscroll-autoscroll-enabled')
  if (savedAutoScroll === 'true') {
    setAutoScrollEnabled(true)
  }
}, [])

// Save to localStorage when toggled
const toggleAutoScroll = () => {
  const newValue = !autoScrollEnabled
  setAutoScrollEnabled(newValue)
  localStorage.setItem('joyscroll-autoscroll-enabled', newValue.toString())
}
```

### Timer Management
- Uses `setTimeout` for main countdown
- Uses `setInterval` for visual countdown updates
- Proper cleanup prevents memory leaks

### Integration Points
- Triggered by TTS completion
- Paused by user interactions (dragging)
- Respects verse changes and navigation

## Configuration
```typescript
const AUTOSCROLL_DELAY = 5000 // 5 seconds - easily adjustable
```

## Benefits
- **Persistent hands-free reading**: Once enabled, works continuously across all verses
- **Consistent pacing**: Ensures even reading rhythm throughout sessions
- **User control**: Easy to enable/disable with preference memory
- **Visual clarity**: Clear countdown feedback for each verse
- **Smart behavior**: Respects user interactions while maintaining state
- **Session continuity**: Remembers preference across browser restarts