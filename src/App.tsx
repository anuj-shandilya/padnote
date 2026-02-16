import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { useNotes } from '@/hooks/useNotes';
import { ThemeProvider } from '@/context/ThemeContext';
import './App.css';

const SIDEBAR_WIDTH = 240;

function NotepadApp() {
  const {
    notes,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    getActiveNote,
  } = useNotes();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const appRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const hasAutoCreated = useRef(false);

  /* Auto-create first note */
  useEffect(() => {
    if (!hasAutoCreated.current && notes.length === 0) {
      hasAutoCreated.current = true;
      const id = createNote();
      setActiveNoteId(id);
    }
  }, [notes.length, createNote, setActiveNoteId]);

  /* Ensure active note exists */
  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId, setActiveNoteId]);

  /* Initial mount animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sidebarRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      });

      gsap.from(editorRef.current, {
        x: 20,
        opacity: 0,
        duration: 0.35,
        delay: 0.05,
        ease: 'power2.out',
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  /* Sidebar toggle animation */
  useEffect(() => {
    if (!sidebarRef.current) return;

    gsap.to(sidebarRef.current, {
      width: sidebarOpen ? SIDEBAR_WIDTH : 0,
      duration: 0.25,
      ease: 'power2.inOut',
    });
  }, [sidebarOpen]);

  const activeNote = getActiveNote();

  return (
    <div
      ref={appRef}
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen(prev => !prev)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="sidebar"
          style={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
        >
          <Sidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={setActiveNoteId}
            onCreateNote={createNote}
            onDeleteNote={deleteNote}
          />
        </div>

        {/* Editor */}
        <div ref={editorRef} className="editor-wrapper flex-1">
          <Editor
            note={activeNote}
            onUpdateNote={updateNote}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotepadApp />
    </ThemeProvider>
  );
}
