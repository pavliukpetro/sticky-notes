import type { Note as NoteType } from '../types';

const STORAGE_KEY = 'sticky-notes-data';

export const loadNotes = (): NoteType[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load notes:', error);
    return [];
  }
};

export const saveNotes = (notes: NoteType[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes:', error);
  }
};