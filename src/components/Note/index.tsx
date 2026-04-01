import React, { memo, useState } from 'react';
import type { Note as NoteType } from '../../types';
import styles from './Note.module.scss';

interface NoteProps {
  note: NoteType;
  onMouseDown: (e: React.MouseEvent, id: string, mode: 'moving' | 'resizing') => void;
  onChangeContent: (id: string, newContent: string) => void;
}

export const Note: React.FC<NoteProps> = memo(({ note, onMouseDown, onChangeContent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (content !== note.content) {
      onChangeContent(note.id, content);
    }
  };

  return (
    <div
      className={`${styles.note} ${styles[`is-${note.color}`] || ''}`}
      style={{
        transform: `translate(${note.position.x}px, ${note.position.y}px)`,
        width: note.size.width,
        height: note.size.height,
      }}
      onMouseDown={(e) => {
        if (!isEditing) {
          onMouseDown(e, note.id, 'moving');
        }
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          className={styles.contentInput}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          autoFocus
        />
      ) : (
        <div className={styles.content}>{note.content}</div>
      )}

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
    prevProps.note.color === nextProps.note.color &&
    prevProps.note.content === nextProps.note.content
  );
});