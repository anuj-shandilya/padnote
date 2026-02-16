// Toolbar component
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Type,
  Heading1,
  Heading2,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import type { EditorState, TextSize } from '@/types';

interface ToolbarProps {
  editorState: EditorState;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  onUnorderedList: () => void;
  onOrderedList: () => void;
  onTextSize: (size: TextSize) => void;
  onHeading: (level: number) => void;
  onQuote: () => void;
  onCode: () => void;
  onAlign: (align: string) => void;
  onUndo: () => void;
  onRedo: () => void;
}

export function Toolbar({
  editorState,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onUnorderedList,
  onOrderedList,
  onTextSize,
  onHeading,
  onQuote,
  onCode,
  onAlign,
  onUndo,
  onRedo,
}: ToolbarProps) {
  const textSizes: { value: TextSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
    { value: 'huge', label: 'Huge' },
  ];

  return (
    <div className="flex items-center gap-1 p-2 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex-wrap">
      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <button onClick={onUndo} className="toolbar-btn" title="Undo">
          <Undo className="w-4 h-4" />
        </button>
        <button onClick={onRedo} className="toolbar-btn" title="Redo">
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--theme-border)]" />

      {/* Text Style */}
      <div className="flex items-center gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="toolbar-btn flex items-center gap-1" title="Text Size">
              <Type className="w-4 h-4" />
              <span className="text-xs capitalize">{editorState.textSize}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
            {textSizes.map((size) => (
              <DropdownMenuItem
                key={size.value}
                onClick={() => onTextSize(size.value)}
                className={`cursor-pointer hover:bg-[var(--theme-accent)] hover:text-white ${
                  editorState.textSize === size.value ? 'bg-[var(--theme-accent)] text-white' : ''
                }`}
              >
                <span style={{ fontSize: size.value === 'small' ? '0.75rem' : size.value === 'large' ? '1.125rem' : size.value === 'huge' ? '1.5rem' : '1rem' }}>
                  {size.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="toolbar-btn" title="Headings">
              <Heading1 className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
            <DropdownMenuItem onClick={() => onHeading(1)} className="cursor-pointer hover:bg-[var(--theme-accent)] hover:text-white">
              <Heading1 className="w-4 h-4 mr-2" /> Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onHeading(2)} className="cursor-pointer hover:bg-[var(--theme-accent)] hover:text-white">
              <Heading2 className="w-4 h-4 mr-2" /> Heading 2
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--theme-border)]" />

      {/* Formatting */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onBold}
          className={`toolbar-btn ${editorState.isBold ? 'active' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={onItalic}
          className={`toolbar-btn ${editorState.isItalic ? 'active' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={onUnderline}
          className={`toolbar-btn ${editorState.isUnderline ? 'active' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={onStrikethrough}
          className={`toolbar-btn ${editorState.isStrikethrough ? 'active' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--theme-border)]" />

      {/* Lists */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onUnorderedList}
          className={`toolbar-btn ${editorState.isUnorderedList ? 'active' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={onOrderedList}
          className={`toolbar-btn ${editorState.isOrderedList ? 'active' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--theme-border)]" />

      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <button onClick={() => onAlign('justifyLeft')} className="toolbar-btn" title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button onClick={() => onAlign('justifyCenter')} className="toolbar-btn" title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button onClick={() => onAlign('justifyRight')} className="toolbar-btn" title="Align Right">
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--theme-border)]" />

      {/* Special */}
      <div className="flex items-center gap-0.5">
        <button onClick={onQuote} className="toolbar-btn" title="Quote">
          <Quote className="w-4 h-4" />
        </button>
        <button onClick={onCode} className="toolbar-btn" title="Code">
          <Code className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
