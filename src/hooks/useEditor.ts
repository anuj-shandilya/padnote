import { useState, useCallback, useRef, useEffect } from 'react';
import type { EditorState, TextSize } from '@/types';

export function useEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    textSize: 'normal',
    isUnorderedList: false,
    isOrderedList: false,
  });

  const updateEditorState = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    setEditorState({
      isBold: document.queryCommandState('bold'),
      isItalic: document.queryCommandState('italic'),
      isUnderline: document.queryCommandState('underline'),
      isStrikethrough: document.queryCommandState('strikeThrough'),
      textSize: editorState.textSize,
      isUnorderedList: document.queryCommandState('insertUnorderedList'),
      isOrderedList: document.queryCommandState('insertOrderedList'),
    });
  }, [editorState.textSize]);

  const execCommand = useCallback((command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    updateEditorState();
    editorRef.current?.focus();
  }, [updateEditorState]);

  const toggleBold = useCallback(() => {
    execCommand('bold');
  }, [execCommand]);

  const toggleItalic = useCallback(() => {
    execCommand('italic');
  }, [execCommand]);

  const toggleUnderline = useCallback(() => {
    execCommand('underline');
  }, [execCommand]);

  const toggleStrikethrough = useCallback(() => {
    execCommand('strikeThrough');
  }, [execCommand]);

  const toggleUnorderedList = useCallback(() => {
    execCommand('insertUnorderedList');
  }, [execCommand]);

  const toggleOrderedList = useCallback(() => {
    execCommand('insertOrderedList');
  }, [execCommand]);

  const setTextSize = useCallback((size: TextSize) => {
    const sizeMap = {
      small: '2',
      normal: '3',
      large: '5',
      huge: '7',
    };
    execCommand('fontSize', sizeMap[size]);
    setEditorState(prev => ({ ...prev, textSize: size }));
  }, [execCommand]);

  const insertHeading = useCallback((level: number) => {
    execCommand('formatBlock', `H${level}`);
  }, [execCommand]);

  const insertQuote = useCallback(() => {
    execCommand('formatBlock', 'BLOCKQUOTE');
  }, [execCommand]);

  const insertCode = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const code = document.createElement('code');
      code.textContent = selection.toString();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(code);
    }
  }, []);

  const getContent = useCallback(() => {
    return editorRef.current?.innerHTML || '';
  }, []);

  const setContent = useCallback((content: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      updateEditorState();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateEditorState]);

  return {
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
  };
}
