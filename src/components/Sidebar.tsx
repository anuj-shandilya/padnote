import { useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  FileText,
  MoreVertical,
  Clock,
  Tag,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Note } from '@/types';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diff = Math.floor((now.getTime() - noteDate.getTime()) / 86400000);

    if (diff === 0) {
      return noteDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (diff === 1) return 'Yesterday';
    if (diff < 7)
      return noteDate.toLocaleDateString('en-US', { weekday: 'short' });

    return noteDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getPreviewText = (content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    return (div.textContent || '').slice(0, 90).replace(/\s+/g, ' ').trim();
  };

  return (
    <div className="h-full flex flex-col border-r border-[var(--theme-border)] bg-[var(--theme-surface)]">
      {/* Search + New */}
      <div className="px-3 py-2 border-b border-[var(--theme-border)]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-secondary)]" />
            <Input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm bg-[var(--theme-bg)] border-[var(--theme-border)]"
            />
          </div>
          <Button
            onClick={onCreateNote}
            size="icon"
            className="h-9 w-9 rounded-lg bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-[var(--theme-text-secondary)]">
            <FileText className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredNotes.map((note) => {
              const active = activeNoteId === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-colors ${active
                      ? 'bg-[var(--theme-accent)] text-white'
                      : 'hover:bg-[var(--theme-bg)]'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">
                        {note.title || 'Untitled'}
                      </h3>

                      <p
                        className={`text-xs line-clamp-2 ${active
                            ? 'text-white/80'
                            : 'text-[var(--theme-text-secondary)]'
                          }`}
                      >
                        {getPreviewText(note.content) || 'No content'}
                      </p>

                      <div
                        className={`mt-1 flex items-center gap-2 text-xs ${active
                            ? 'text-white/60'
                            : 'text-[var(--theme-text-secondary)]'
                          }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(note.updatedAt)}</span>
                        {note.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <Tag className="w-3 h-3" />
                            <span>{note.tags.length}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className={`opacity-0 group-hover:opacity-100 p-1 rounded ${active
                              ? 'hover:bg-white/20'
                              : 'hover:bg-[var(--theme-border)]'
                            }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setNoteToDelete(note.id);
                          }}
                          className="text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-3 py-2 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text-secondary)] flex justify-between">
        <span>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
        <span>
          {notes.reduce((a, n) => a + (n.content.length || 0), 0).toLocaleString()} chars
        </span>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (noteToDelete) {
                  onDeleteNote(noteToDelete);
                  setNoteToDelete(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
