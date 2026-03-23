import React, { memo } from 'react';
import type { Note as NoteType } from '../../types';
import styles from './Note.module.scss';

interface NoteProps {
  note: NoteType;
  onMouseDown: (e: React.MouseEvent, id: string, mode: 'moving' | 'resizing') => void;
}

export const Note: React.FC<NoteProps> = memo(({ note, onMouseDown }) => {
  return (
    <div
      className={`${styles.note} ${styles[`is-${note.color}`] || ''}`}
      style={{
        transform: `translate(${note.position.x}px, ${note.position.y}px)`,
        width: note.size.width,
        height: note.size.height,
        zIndex: note.zIndex,
      }}
      onMouseDown={(e) => onMouseDown(e, note.id, 'moving')}
    >
      <div className={styles.content}>{note.content}</div>

      <div
        className={styles.resizeHandle}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e, note.id, 'resizing');
        }}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.note.position.x === nextProps.note.position.x &&
    prevProps.note.position.y === nextProps.note.position.y &&
    prevProps.note.size.width === nextProps.note.size.width &&
    prevProps.note.size.height === nextProps.note.size.height &&
    prevProps.note.zIndex === nextProps.note.zIndex &&
    prevProps.note.color === nextProps.note.color
  );
});