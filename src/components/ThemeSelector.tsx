import React from 'react';
import {
  Sun,
  Moon,
  Star,
  Sparkles,
  Coffee,
  Leaf,
  Heart,
  Palette,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import type { Theme } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Sun,
  Moon,
  Star,
  Sparkles,
  Coffee,
  Leaf,
  Heart,
};

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();

  const currentTheme = themes.find((t) => t.class === theme);
  const CurrentIcon = currentTheme ? iconMap[currentTheme.icon] : Palette;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--theme-bg)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]"
          title="Change theme"
        >
          <CurrentIcon className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 bg-[var(--theme-surface)] border-[var(--theme-border)] p-1"
      >
        {themes.map((t) => {
          const Icon = iconMap[t.icon];
          const active = theme === t.class;

          return (
            <DropdownMenuItem
              key={t.class}
              onClick={() => setTheme(t.class as Theme)}
              className={`flex items-start gap-3 rounded-md px-3 py-2 cursor-pointer ${active
                  ? 'bg-[var(--theme-accent)]/10'
                  : 'hover:bg-[var(--theme-bg)]'
                }`}
            >
              {/* Icon */}
              <div
                className={`mt-0.5 ${active
                    ? 'text-[var(--theme-accent)]'
                    : 'text-[var(--theme-text-secondary)]'
                  }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${active
                      ? 'text-[var(--theme-text)]'
                      : 'text-[var(--theme-text)]'
                    }`}
                >
                  {t.name}
                </div>
                <div className="text-xs text-[var(--theme-text-secondary)]">
                  {t.description}
                </div>
              </div>

              {/* Active indicator */}
              {active && (
                <span className="mt-1 w-2 h-2 rounded-full bg-[var(--theme-accent)]" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
