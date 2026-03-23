import React from 'react';
import type { NoteSizePreset } from '../../types';
import styles from './Controls.module.scss';

const AVAILABLE_COLORS = ['yellow', 'blue', 'green', 'pink'];
const AVAILABLE_SIZES: NoteSizePreset[] = ['small', 'medium', 'large'];

interface ControlsProps {
  activeColor: string;
  onColorChange: (color: string) => void;
  activeSize: NoteSizePreset;
  onSizeChange: (size: NoteSizePreset) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  activeColor,
  onColorChange,
  activeSize,
  onSizeChange
}) => {
  return (
    <div className={styles.controlsPanel}>
      <div>
        <div className={styles.label}>Next Note:</div>
        <div><small>Double-click board to place</small></div>
      </div>

      <div className={styles.sizePicker}>
        {AVAILABLE_SIZES.map((size) => (
          <button
            key={size}
            className={`${styles.sizeBtn} ${activeSize === size ? styles.activeSize : ''}`}
            onClick={() => onSizeChange(size)}
          >
            {size.charAt(0).toUpperCase() + size.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.colorPicker}>
        {AVAILABLE_COLORS.map((color) => (
          <button
            key={color}
            className={`${styles.colorBtn} ${styles[`is-${color}`]} ${activeColor === color ? styles.activeColor : ''}`}
            onClick={() => onColorChange(color)}
            title={`Select ${color}`}
          />
        ))}
      </div>
    </div>
  );
};