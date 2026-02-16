import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  MoreHorizontal,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Toolbar } from './Toolbar';
import { ThemeSelector } from './ThemeSelector';
import { useEditor } from '@/hooks/useEditor';
import type { Note } from '@/types';

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

export function Editor({ note, onUpdateNote }: EditorProps) {
  const {
    editorRef,
    editorState,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
    toggleUnorderedList,
    toggleOrderedList,
    setTextSize,
    insertHeading,
    insertQuote,
    insertCode,
    getContent,
    setContent,
    execCommand,
  } = useEditor();

  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const charCountRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -----------------------------
     Load note
  ----------------------------- */
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      updateCounts(note.content);
      setIsEditingTitle(false);
    }
  }, [note?.id]);

  /* -----------------------------
     Focus title input
  ----------------------------- */
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const updateCounts = useCallback((content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || '';
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, []);

  /* -----------------------------
     Title handlers
  ----------------------------- */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    note && onUpdateNote(note.id, { title: newTitle });
  };

  const handleTitleBlur = () => setIsEditingTitle(false);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      editorRef.current?.focus();
    }
  };

  /* -----------------------------
     Content change
  ----------------------------- */
  const handleContentChange = () => {
    const content = getContent();
    updateCounts(content);
    note && onUpdateNote(note.id, { content });
  };

  /* -----------------------------
     Clipboard / Export / Share
  ----------------------------- */
  const handleCopy = async () => {
    if (!note) return;
    const div = document.createElement('div');
    div.innerHTML = note.content;
    await navigator.clipboard.writeText(div.textContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!note) return;
    const div = document.createElement('div');
    div.innerHTML = note.content;
    const text = div.textContent || '';
    const blob = new Blob([`${note.title}\n\n${text}`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${note.title || 'untitled'}.txt`;
    a.click();
  };

  const handleShare = async () => {
    if (!note || !navigator.share) return;
    const div = document.createElement('div');
    div.innerHTML = note.content;
    try {
      await navigator.share({
        title: note.title,
        text: (div.textContent || '').slice(0, 200),
      });
    } catch { }
  };

  /* -----------------------------
     Image insertion
  ----------------------------- */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => insertImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const insertImage = (src: string) => {
    if (!editorRef.current) return;

    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '8px';
    img.style.margin = '1rem 0';

    const sel = window.getSelection();
    if (sel?.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      range.setStartAfter(img);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editorRef.current.appendChild(img);
    }

    img.after(document.createElement('p'));
    handleContentChange();
    setImageDialogOpen(false);
    setImageUrl('');
  };

  const handleInsertImageUrl = () => imageUrl.trim() && insertImage(imageUrl.trim());

  const openFilePicker = () => fileInputRef.current?.click();

  /* -----------------------------
     Welcome content
  ----------------------------- */
  useEffect(() => {
    if (note && !note.content && editorRef.current) {
      const welcome = '<p>Start writing your thoughts here...</p>';
      setContent(welcome);
      onUpdateNote(note.id, { content: welcome });
    }
  }, [note?.id]);

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4 text-[var(--theme-accent)] opacity-60" />
          <p className="text-sm text-[var(--theme-text-secondary)]">
            Select or create a note to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--theme-bg)]">
      {/* Title */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--theme-border)]">
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled Note"
            className="text-lg font-medium bg-transparent border-none px-0 focus-visible:ring-0"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-lg font-medium flex-1 text-left hover:bg-[var(--theme-surface)] rounded px-1"
          >
            {title || 'Click to add title...'}
          </button>
        )}

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setImageDialogOpen(true)}>
            <ImageIcon className="w-5 h-5" />
          </Button>
          <ThemeSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" /> Export
              </DropdownMenuItem>
              {'share' in navigator && (
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-[var(--theme-border)]">
        <Toolbar
          editorState={editorState}
          onBold={toggleBold}
          onItalic={toggleItalic}
          onUnderline={toggleUnderline}
          onStrikethrough={toggleStrikethrough}
          onUnorderedList={toggleUnorderedList}
          onOrderedList={toggleOrderedList}
          onTextSize={setTextSize}
          onHeading={insertHeading}
          onQuote={insertQuote}
          onCode={insertCode}
          onAlign={align => execCommand(align)}
          onUndo={() => execCommand('undo')}
          onRedo={() => execCommand('redo')}
        />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          className="editor-content px-8 py-6 text-lg min-h-full"
          suppressContentEditableWarning
        />

        {/* Footer */}
        <div
          ref={charCountRef}
          className="px-8 py-4 flex justify-end gap-4 text-xs text-[var(--theme-text-secondary)] border-t border-dashed border-[var(--theme-border)]"
        >
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>

        <div className="h-6" />
      </div>


      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} hidden />

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={openFilePicker} variant="outline" className="w-full">
              Upload from device
            </Button>
            <Input
              placeholder="Image URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleInsertImageUrl()}
            />
            <Button onClick={handleInsertImageUrl} disabled={!imageUrl.trim()}>
              Insert
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
