import type { NoteSizePreset } from '../types';

export const getDimensionsFromPreset = (size: NoteSizePreset) => {
  switch (size) {
    case 'small': return { width: 150, height: 150 };
    case 'large': return { width: 300, height: 300 };
    case 'medium':
    default: return { width: 200, height: 200 };
  }
};

export const getNextZIndex = (notes: { zIndex: number }[]) => {
    if (notes.length === 0 || notes.length === 1) return 1;

    return Math.max(...notes.map(n => n.zIndex)) + 1;
};