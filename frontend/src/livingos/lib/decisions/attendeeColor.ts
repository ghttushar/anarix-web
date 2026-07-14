// Deterministic color per attendee. Same name → same hue across the app.
// Uses HSL so the palette stays cohesive with the periwinkle system.

const HUES = [212, 268, 32, 168, 348, 194, 42, 288, 148, 12, 232, 108];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function attendeeInitials(name: string): string {
  const cleaned = name.replace(/\(.*?\)/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface AttendeeColor {
  bg: string;
  fg: string;
  ring: string;
}

export function attendeeColor(name: string): AttendeeColor {
  const hue = HUES[hashString(name) % HUES.length];
  return {
    bg: `hsl(${hue} 70% 92%)`,
    fg: `hsl(${hue} 65% 32%)`,
    ring: `hsl(${hue} 60% 55%)`,
  };
}
