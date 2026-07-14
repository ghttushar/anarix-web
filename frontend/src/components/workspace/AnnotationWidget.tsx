import { Textarea } from "@/components/ui/textarea";
import { Pin } from "lucide-react";

interface AnnotationWidgetProps {
  config: Record<string, unknown>;
  onConfigChange: (config: Record<string, unknown>) => void;
}

const postItColors = [
  { bg: "#FEF9C3", border: "#FDE68A", text: "#713F12" }, // yellow
  { bg: "#FCE7F3", border: "#F9A8D4", text: "#831843" }, // pink
  { bg: "#DBEAFE", border: "#93C5FD", text: "#1E3A5F" }, // blue
  { bg: "#DCFCE7", border: "#86EFAC", text: "#14532D" }, // green
];

const rotations = [-1.5, 1, -0.5, 1.5, -1, 0.5];

export function AnnotationWidget({ config, onConfigChange }: AnnotationWidgetProps) {
  const text = (config.text as string) || "";
  const colorIndex = (config.colorIndex as number) || 0;
  const color = postItColors[colorIndex % postItColors.length];
  const rotation = rotations[(colorIndex * 2 + 1) % rotations.length];

  return (
    <div
      className="relative h-full rounded-sm p-3 shadow-md"
      style={{
        backgroundColor: color.bg,
        borderTop: `3px solid ${color.border}`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Pin icon */}
      <div className="absolute top-1 right-2">
        <Pin className="h-4 w-4" style={{ color: color.border }} />
      </div>

      <Textarea
        value={text}
        onChange={(e) => onConfigChange({ ...config, text: e.target.value })}
        placeholder="Write your notes here..."
        className="h-full resize-none border-0 bg-transparent focus-visible:ring-0 text-sm p-0 shadow-none"
        style={{ color: color.text, fontFamily: "'Noto Sans', sans-serif" }}
        maxLength={500}
      />

      {/* Color picker dots */}
      <div className="absolute bottom-2 left-3 flex gap-1.5">
        {postItColors.map((c, i) => (
          <button
            key={i}
            onClick={() => onConfigChange({ ...config, colorIndex: i })}
            className="h-3.5 w-3.5 rounded-full border border-black/10 transition-transform hover:scale-125"
            style={{ backgroundColor: c.bg, outline: colorIndex === i ? `2px solid ${c.border}` : "none", outlineOffset: "1px" }}
          />
        ))}
      </div>
    </div>
  );
}
