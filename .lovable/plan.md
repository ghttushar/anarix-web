## Goal

Make the in-progress generation card sit in the conversation flow exactly like an assistant message — with the small Aan avatar on the left and the card aligned to the message column — so it reads as part of Aan's reply rather than a floating standalone block.  
also write the details of what report is generating

## Today's behavior

The loader is wrapped in `<div className="flex justify-center py-2">` and rendered without an avatar, so it's centered in the column and visually disconnected from the surrounding messages.

## Change

### `src/components/aan/AanConversation.tsx`

Restructure the `{isGenerating && (...)}` block to mirror the assistant-message layout used in the `messages.map(...)` above:

```tsx
{isGenerating && (
  <div className="flex flex-row gap-3">
    {/* Avatar — same as assistant messages */}
    <div className={cn(
      "flex h-8 w-8 shrink-0 items-center justify-center",
      newBranding ? "text-foreground" : "rounded-full aan-gradient text-white"
    )}>
      {newBranding ? (
        <AanMascot size={20} state="anchor" interactive={false} />
      ) : (
        <AanGlyph className="h-4 w-4" />
      )}
    </div>

    {/* Loader card in the message column */}
    <div className="flex max-w-[80%] flex-col gap-2 items-start">
      <div className="flex-col gap-3 px-6 py-5 rounded-2xl border border-border bg-card shadow-sm w-fit min-w-[280px] flex items-center justify-start">
        {/* anchor + text — unchanged */}
        ...
      </div>
    </div>
  </div>
)}
```

- Outer wrapper: `flex flex-row gap-3` (same spacing/direction as assistant messages).
- Avatar: identical to the assistant avatar in the map loop (size 20 anchor mascot in new branding, AanGlyph fallback otherwise).
- Bubble column: `flex max-w-[80%] flex-col gap-2 items-start` (same as message bubble column).
- Loader card classes preserved as-is (centered children, left-aligned in column).

## Out of scope

- No mascot or progress logic changes.
- No timestamp under the loader (it's a transient working state).