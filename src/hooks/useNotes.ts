import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActiveInteraction, NoteSizePreset, Note as NoteType } from '../types';
import { isPointInRect } from '../utils/geometry';
import { getDimensionsFromPreset, getNextZIndex } from '../utils/notes';
import { loadNotes, saveNotes } from '../utils/storage';

export const useNotes = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] = useState<NoteType[]>(loadNotes);

  const [interaction, setInteraction] = useState<ActiveInteraction | null>(null);
  const [isHoveringTrash, setIsHoveringTrash] = useState(false);
  const [activeColor, setActiveColor] = useState('yellow');
  const [activeSize, setActiveSize] = useState<NoteSizePreset>('medium');

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string, mode: 'moving' | 'resizing') => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const nextZ = getNextZIndex(notes);

    setNotes(prev => prev.map(n => n.id === id ? { ...n, zIndex: nextZ } : n));

    setInteraction({
      noteId: id,
      mode,
      offset: {
        x: e.clientX - note.position.x,
        y: e.clientY - note.position.y
      }
    });
  }, [notes]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interaction) return;

    if (interaction.mode === 'moving' && trashRef.current) {
      const isOverTrash = isPointInRect(e.clientX, e.clientY, trashRef.current.getBoundingClientRect());

      setIsHoveringTrash(isOverTrash);
    }

    setNotes(prev => prev.map(note => {
      if (note.id !== interaction.noteId) return note;

      if (interaction.mode === 'moving') {
        return {
          ...note,
          position: {
            x: e.clientX - interaction.offset.x,
            y: e.clientY - interaction.offset.y
          }
        };
      } else {
        return {
          ...note,
          size: {
            width: Math.max(100, e.clientX - note.position.x),
            height: Math.max(100, e.clientY - note.position.y)
          }
        };
      }
    }));
  };

  const handleMouseUp = () => {
    if (!interaction) return;

    if (interaction.mode === 'moving' && isHoveringTrash) {
      setNotes(prev => prev.filter(note => note.id !== interaction.noteId));
    }

    setInteraction(null);
    setIsHoveringTrash(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (e.target !== boardRef.current) return;

    const dimensions = getDimensionsFromPreset(activeSize);

    const newNote: NoteType = {
      id: crypto.randomUUID(),
      position: {
        x: e.clientX,
        y: e.clientY,
      },
      size: dimensions,
      content: 'Double click to edit...',
      color: activeColor,
      zIndex: notes.length > 0 ? Math.max(...notes.map(n => n.zIndex)) + 1 : 1,
    };

    setNotes((prev) => [...prev, newNote]);
  };

  return {
    boardRef,
    trashRef,
    notes,
    isHoveringTrash,
    activeColor,
    setActiveColor,
    activeSize,
    setActiveSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
  };
};