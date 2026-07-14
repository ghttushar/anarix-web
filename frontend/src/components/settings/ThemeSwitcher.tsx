import { useTheme } from "@/contexts/ThemeContext";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeOption {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ReactNode;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: <Sun className="h-5 w-5" />,
    description: "Clean and bright interface",
  },
  {
    value: "dark",
    label: "Dark",
    icon: <Moon className="h-5 w-5" />,
    description: "Easier on the eyes in low light",
  },
  {
    value: "system",
    label: "System",
    icon: <Monitor className="h-5 w-5" />,
    description: "Follows your device settings",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-4">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "group relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all",
            theme === option.value
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              theme === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            {option.icon}
          </div>
          <div className="text-center">
            <p
              className={cn(
                "font-medium",
                theme === option.value ? "text-primary" : "text-foreground"
              )}
            >
              {option.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {option.description}
            </p>
          </div>
          {theme === option.value && (
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
