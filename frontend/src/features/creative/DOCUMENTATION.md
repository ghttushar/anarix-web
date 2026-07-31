# Anarix Creative UI Features - Complete Documentation

## Overview

This module contains 10 creative UI enhancement features designed to make Anarix visually distinctive and memorable. Each feature is modular, well-documented, and can be enabled/disabled independently.

---

## Feature 1: Morphing Metric Cards

### Purpose
Numbers animate smoothly when values change, with color gradient shifts based on performance (green pulse for positive trends) and micro-interactions on hover showing mini sparklines.

### Entry Point
`src/features/creative/MorphingNumber.tsx`

### Usage
```tsx
import { MorphingNumber } from '@/features/creative';

<MorphingNumber 
  value={123456.78}
  format="currency"
  showTrend={true}
  trendValue={5.2}
/>
```

### Props
- `value: number` - The number to display
- `format?: 'number' | 'currency' | 'percent'` - Formatting type
- `duration?: number` - Animation duration in ms (default: 800)
- `showTrend?: boolean` - Show trend indicator
- `trendValue?: number` - Percentage change for trend

### How It Works
Uses CSS transitions and requestAnimationFrame to smoothly interpolate between old and new values. The animation uses easing functions for natural motion.

---

## Feature 2: Ambient Data Background

### Purpose
Subtle, moving dot pattern in background that represents live data flow. Dots move faster when more activity happening. Very subtle, doesn't distract.

### Entry Point
`src/features/creative/AmbientBackground.tsx`

### Usage
```tsx
import { AmbientBackground } from '@/features/creative';

// In your layout:
<AmbientBackground intensity="low" />
```

### Props
- `intensity?: 'low' | 'medium' | 'high'` - Activity level
- `color?: string` - Dot color (uses primary by default)
- `dotCount?: number` - Number of dots (default: 50)

### How It Works
Uses CSS animations with multiple layers of dots at different speeds. GPU-accelerated using transform and opacity only.

---

## Feature 3: Command Palette (Cmd+K)

### Purpose
Quick actions from anywhere in app. Search across campaigns, products, metrics. Recent actions list. Aan AI quick ask.

### Entry Point
`src/features/creative/CommandPalette.tsx`

### Keyboard Shortcuts
- `Cmd/Ctrl + K` - Open command palette
- `Escape` - Close palette
- `↑/↓` - Navigate results
- `Enter` - Execute selected action
- `/` - Focus search (when palette is open)

### Usage
```tsx
import { CommandPalette, useCommandPalette } from '@/features/creative';

// The palette is globally available via CreativeFeatures
// To programmatically open:
const { open, close } = useCommandPalette();
open();
```

### Search Categories
1. **Pages** - Navigate to any page
2. **Actions** - Quick actions (new campaign, sync data)
3. **Campaigns** - Search campaigns by name
4. **Products** - Search products
5. **Aan AI** - Ask AI directly

---

## Feature 4: Floating Action Island

### Purpose
Persistent bottom-center floating element. Shows current context (selected campaign, date range). Quick actions relevant to current page. Aan AI mini-chat trigger.

### Entry Point
`src/features/creative/FloatingActionIsland.tsx`

### Usage
Automatically included via `<CreativeFeatures />`. Context-aware based on current route.

### Contextual Actions by Page
- **Dashboard**: Refresh data, Export report, Share
- **Campaigns**: New campaign, Bulk edit, Filter
- **Day Parting**: Create schedule, View history
- **Settings**: Save changes, Reset

---

## Feature 5: Glassmorphism Panels

### Purpose
Frosted glass effect for AI workspace. Subtle blur and transparency. Distinguishes AI space from core analytics.

### Entry Point
`src/features/creative/GlassmorphismPanel.tsx`

### Usage
```tsx
import { GlassmorphismPanel } from '@/features/creative';

<GlassmorphismPanel blur="md" opacity={0.8}>
  <div>AI Content here</div>
</GlassmorphismPanel>
```

### Props
- `blur?: 'sm' | 'md' | 'lg'` - Blur intensity
- `opacity?: number` - Background opacity (0-1)
- `gradient?: boolean` - Add gradient overlay
- `border?: boolean` - Add subtle border

---

## Feature 6: Data Storytelling Mode

### Purpose
"Generate Story" button on any dashboard. Creates a narrative walkthrough of the data. Animated highlights and annotations. Shareable as a guided tour.

### Entry Point
`src/features/creative/DataStoryMode.tsx`

### Usage
```tsx
import { DataStoryMode, useDataStory } from '@/features/creative';

const { startStory, isPlaying, currentStep } = useDataStory();

// Trigger story mode
<Button onClick={() => startStory(storySteps)}>
  Generate Story
</Button>
```

### Story Step Format
```tsx
const storySteps = [
  {
    target: '#revenue-card',
    title: 'Revenue is up!',
    description: 'Your revenue increased 15% this month.',
    highlightColor: 'success'
  },
  // ... more steps
];
```

---

## Feature 7: Split-Screen Comparison

### Purpose
Compare any two time periods side-by-side. Synced scrolling in tables. Difference highlighting (red/green overlays).

### Entry Point
`src/features/creative/SplitScreenComparison.tsx`

### Usage
```tsx
import { SplitScreenComparison } from '@/features/creative';

<SplitScreenComparison
  leftPeriod={{ start: '2024-01-01', end: '2024-01-31' }}
  rightPeriod={{ start: '2024-02-01', end: '2024-02-28' }}
  data={comparisonData}
/>
```

---

## Feature 8: Metric Pulsing

### Purpose
When a metric changes significantly, the card pulses once. Subtle ring animation expands outward. Draws attention without being alarming.

### Entry Point
`src/features/creative/MetricPulse.tsx`

### Usage
```tsx
import { MetricPulse } from '@/features/creative';

<MetricPulse 
  active={hasSignificantChange} 
  color="success"
>
  <MetricCard value={revenue} />
</MetricPulse>
```

### Props
- `active: boolean` - Trigger pulse animation
- `color?: 'primary' | 'success' | 'warning' | 'destructive'`
- `duration?: number` - Animation duration in ms

---

## Feature 9: Progress Rings

### Purpose
Circular progress indicators for goals/targets. More visually distinctive. Animated fill with easing.

### Entry Point
`src/features/creative/ProgressRing.tsx`

### Usage
```tsx
import { ProgressRing } from '@/features/creative';

<ProgressRing 
  value={75}
  max={100}
  size="lg"
  showLabel
  color="success"
/>
```

### Props
- `value: number` - Current value
- `max: number` - Maximum value
- `size?: 'sm' | 'md' | 'lg' | 'xl'`
- `showLabel?: boolean` - Show percentage in center
- `color?: string` - Ring color
- `thickness?: number` - Ring thickness

---

## Feature 10: Keyboard Navigation

### Purpose
Vim-like shortcuts (j/k for up/down in tables). Number keys for quick section jumping. Visual key hint overlay (press ? to show). Makes power users incredibly fast.

### Entry Point
`src/features/creative/KeyboardNavigation.tsx`

### All Keyboard Shortcuts

#### Global Shortcuts
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `?` | Show keyboard shortcuts overlay |
| `Escape` | Close modals/overlays |
| `g + h` | Go to Dashboard (home) |
| `g + c` | Go to Campaigns |
| `g + d` | Go to Day Parting |
| `g + s` | Go to Settings |

#### Table Navigation
| Shortcut | Action |
|----------|--------|
| `j` | Move down one row |
| `k` | Move up one row |
| `Enter` | Open selected row |
| `Space` | Toggle row selection |
| `Shift + j` | Extend selection down |
| `Shift + k` | Extend selection up |
| `gg` | Jump to first row |
| `G` | Jump to last row |

#### Quick Actions
| Shortcut | Action |
|----------|--------|
| `n` | New item (context-aware) |
| `e` | Edit selected item |
| `d` | Delete selected item |
| `r` | Refresh data |
| `/` | Focus search |
| `1-9` | Jump to section by number |

### Usage
```tsx
import { KeyboardNavigationProvider, useKeyboardShortcuts } from '@/features/creative';

// Wrap your app
<KeyboardNavigationProvider>
  <App />
</KeyboardNavigationProvider>

// Use in components
const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

useEffect(() => {
  registerShortcut('n', () => createNewItem());
  return () => unregisterShortcut('n');
}, []);
```

---

## Integration

All features are bundled in a single provider component:

```tsx
// In App.tsx
import { CreativeFeatures } from '@/features/creative';

function App() {
  return (
    <ThemeProvider>
      <CreativeFeatures>
        {/* Your app content */}
        <Routes>...</Routes>
      </CreativeFeatures>
    </ThemeProvider>
  );
}
```

---

## Performance Considerations

1. **Ambient Background**: Uses GPU-accelerated animations only
2. **Morphing Numbers**: Uses requestAnimationFrame for smooth 60fps
3. **Command Palette**: Lazy-loaded, only renders when open
4. **Keyboard Navigation**: Event delegation at document level
5. **All animations**: Respect `prefers-reduced-motion`

---

## Disabling Features

### Disable All Features
Remove `<CreativeFeatures>` from App.tsx and delete this folder.

### Disable Individual Features
Comment out the specific export in `src/features/creative/index.ts`

### Feature Flags (Future)
```tsx
<CreativeFeatures
  enabledFeatures={{
    commandPalette: true,
    floatingIsland: true,
    ambientBackground: false,
    // ...
  }}
/>
```

---

## Customization

Each feature accepts customization props. Override defaults in your theme configuration or pass props directly.

### Theme Tokens Used
- `--primary`: Main brand color for accents
- `--background`: Base background
- `--foreground`: Text color
- `--border`: Borders and dividers
- `--muted`: Subtle backgrounds
- `--success/warning/destructive`: Status colors

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All features gracefully degrade on older browsers.
