import { useState, useEffect, useCallback } from 'react';
import type { Note } from '@/types';

const STORAGE_KEY = 'notepad-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((note: Note) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    return newNote.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  }, [activeNoteId]);

  const getActiveNote = useCallback(() => {
    return notes.find(note => note.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  const searchNotes = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(lowercaseQuery) ||
        note.content.toLowerCase().includes(lowercaseQuery) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [notes]);

  return {
    notes,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    getActiveNote,
    searchNotes,
  };
}
