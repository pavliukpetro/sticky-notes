export interface Vector2D {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Note {
  id: string;
  position: Vector2D;
  size: Dimensions;
  content: string;
  color: string;
  zIndex: number;
}

export type InteractionMode = 'moving' | 'resizing' | null;

export interface ActiveInteraction {
  noteId: string;
  mode: InteractionMode;
  offset: Vector2D;
}
export type NoteSizePreset = 'small' | 'medium' | 'large';