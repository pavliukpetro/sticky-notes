import React, { useEffect } from "react";
import { useNotes } from "../../hooks/useNotes";
import { Controls } from "../Controls";
import { Note } from "../Note";
import styles from "./Board.module.scss";

export const Board: React.FC = () => {
  const {
    boardRef,
    trashRef,
    notes,
    // isHoveringTrash,
    activeColor,
    setActiveColor,
    activeSize,
    setActiveSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    updateNoteContent,
  } = useNotes(styles.trashActive);

  useEffect(() => {
    console.log("Notes updated:", notes);
  }, [notes]);

  return (
    <div
      ref={boardRef}
      className={styles.board}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onMouseLeave={handleMouseUp}
    >
      <Controls
        activeColor={activeColor}
        onColorChange={setActiveColor}
        activeSize={activeSize}
        onSizeChange={setActiveSize}
      />

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onMouseDown={handleMouseDown}
          onChangeContent={updateNoteContent}
        />
      ))}

      <div ref={trashRef} className={styles.trashZone}>
        Trash
      </div>
    </div>
  );
};
