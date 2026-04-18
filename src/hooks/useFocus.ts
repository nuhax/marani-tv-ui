import { useState, useEffect, useCallback } from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface FocusableElement {
  id: string;
  onEnter?: () => void;
}

export const useFocus = (initialId?: string) => {
  const [focusedId, setFocusedId] = useState<string | null>(initialId || null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Standard TV Remote Codes
    const keyMap: Record<string, Direction | 'enter' | 'back'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      Enter: 'enter',
      Escape: 'back',
      Backspace: 'back',
    };

    const action = keyMap[e.key];
    if (!action) return;

    // Dispatch a custom event for components to handle their own navigation
    const event = new CustomEvent('tv-navigation', { 
      detail: { action, currentFocusedId: focusedId } 
    });
    window.dispatchEvent(event);
  }, [focusedId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { focusedId, setFocusedId };
};