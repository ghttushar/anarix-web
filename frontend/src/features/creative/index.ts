/**
 * ANARIX CREATIVE UI FEATURES
 * ============================
 * 
 * This module contains all 10 creative UI enhancement features.
 * Each feature is modular and can be disabled by removing its import.
 * 
 * DOCUMENTATION:
 * See src/features/creative/DOCUMENTATION.md for complete usage guide
 * 
 * FEATURES:
 * 1. Morphing Metric Cards - Animated number transitions
 * 2. Ambient Data Background - Subtle particle animation
 * 3. Command Palette (Cmd+K) - Quick search and actions
 * 4. Floating Action Island - Contextual actions bar
 * 5. Glassmorphism Panels - AI workspace styling
 * 6. Data Storytelling Mode - Narrative data presentations
 * 7. Split-Screen Comparison - Side-by-side period comparison
 * 8. Metric Pulsing - Attention-drawing animations
 * 9. Progress Rings - Circular progress indicators
 * 10. Keyboard Navigation - Vim-like shortcuts
 * 
 * TO REMOVE ALL CREATIVE FEATURES:
 * 1. Delete this entire folder (src/features/creative)
 * 2. Remove <CreativeFeatures /> from App.tsx
 * 3. Remove imports from components that use creative utilities
 */

export { CommandPalette, useCommandPalette } from './CommandPalette';
export { FloatingActionIsland } from './FloatingActionIsland';
export { AmbientBackground } from './AmbientBackground';
export { MorphingNumber } from './MorphingNumber';
export { MetricPulse } from './MetricPulse';
export { ProgressRing } from './ProgressRing';
export { GlassmorphismPanel } from './GlassmorphismPanel';
export { KeyboardNavigationProvider, useKeyboardShortcuts } from './KeyboardNavigation';
export { DataStoryMode, useDataStory } from './DataStoryMode';
export { SplitScreenComparison } from './SplitScreenComparison';
export { CreativeFeatures } from './CreativeFeatures';
