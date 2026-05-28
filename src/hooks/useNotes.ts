import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ActiveInteraction,
  NoteSizePreset,
  Note as NoteType,
} from "../types";
import { isPointInRect } from "../utils/geometry";
import { getDimensionsFromPreset } from "../utils/notes";
import { loadNotes, saveNotes } from "../utils/storage";

export const useNotes = (activeTrashClass: string) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const activeNoteRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] = useState<NoteType[]>(loadNotes);

  const latestNotes = useRef(notes);

  const interactionRef = useRef<ActiveInteraction | null>(null);

  const isHoveringTrashRef = useRef(false);

  const [activeColor, setActiveColor] = useState("yellow");
  const [activeSize, setActiveSize] = useState<NoteSizePreset>("medium");

  useEffect(() => {
    latestNotes.current = notes;

    const timeoutId = setTimeout(() => {
      saveNotes(notes);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [notes]);

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      id: string,
      mode: "moving" | "resizing",
      noteElementRef: HTMLDivElement,
    ) => {
      const currentNotes = latestNotes.current;
      const note = currentNotes.find(n => n.id === id);
      if (!note) return;

      activeNoteRef.current = noteElementRef;

      setNotes((prev) => {
        if (prev[prev.length - 1].id === id) return prev;

        const filteredNotes = prev.filter(n => n.id !== id);

        return [...filteredNotes, note];
      });

      interactionRef.current = {
        noteId: id,
        mode,
        offset: {
          x: e.clientX - note.position.x,
          y: e.clientY - note.position.y,
        },
      };
    },
    [],
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactionRef.current) return;

    const activeNoteRefCurrent = activeNoteRef.current;

    if (interactionRef.current.mode === "moving" && trashRef.current) {
      const isOverTrash = isPointInRect(
        e.clientX,
        e.clientY,
        trashRef.current.getBoundingClientRect(),
      );

      if (isOverTrash !== isHoveringTrashRef.current) {
        isHoveringTrashRef.current = isOverTrash;

        trashRef.current!.classList.toggle(
          activeTrashClass,
          isOverTrash,
        );
      }
    }

    if (interactionRef.current.mode === "moving") {
      activeNoteRefCurrent!.style.transform = `translate(${e.clientX - interactionRef.current.offset.x}px, ${e.clientY - interactionRef.current.offset.y}px)`;
    } else {
      const currentNote = latestNotes.current.find(
        (note) => note.id === interactionRef.current?.noteId,
      );

      if (!currentNote) return;

      activeNoteRefCurrent!.style.width = `${Math.max(100, e.clientX - currentNote.position.x)}px`;
      activeNoteRefCurrent!.style.height = `${Math.max(100, e.clientY - currentNote.position.y)}px`;
    }
  };

  const handleMouseUp = () => {
    if (!interactionRef.current) return;

    if (
      interactionRef.current.mode === "moving" &&
      isHoveringTrashRef.current
    ) {
      const noteId = interactionRef.current.noteId;
      activeNoteRef.current = null;

      setNotes((prev) => prev.filter((note) => note.id !== noteId));

      interactionRef.current = null;
      isHoveringTrashRef.current = false;
      trashRef.current?.classList.remove(activeTrashClass);

      return;
    }

    if (activeNoteRef.current) {
      const mode = interactionRef.current.mode;
      const noteId = interactionRef.current.noteId;
      const noteEl = activeNoteRef.current;

      setNotes((prev) => {
        return prev.map((note) => {
          if (note.id !== noteId) return note;

          if (mode === "moving") {
            return {
              ...note,
              position: {
                x: parseInt(
                  noteEl.style.transform
                    .split("translate(")[1]
                    .split("px")[0],
                ),
                y: parseInt(
                  noteEl.style.transform
                    .split(", ")[1]
                    .split("px)")[0],
                ),
              },
            };
          } else {
            return {
              ...note,
              size: {
                width: noteEl.offsetWidth,
                height: noteEl.offsetHeight,
              },
            };
          }
        });
      });
    }

    interactionRef.current = null;
    activeNoteRef.current = null;
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
      content: "Double click to edit...",
      color: activeColor,
    };

    setNotes((prev) => [...prev, newNote]);
  };

  const updateNoteContent = useCallback((id: string, newContent: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, content: newContent } : note,
      ),
    );
  }, []);

  return {
    boardRef,
    trashRef,
    notes,
    activeColor,
    setActiveColor,
    activeSize,
    setActiveSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    updateNoteContent,
  };
};
