import { useEffect } from 'react';

export type Item = [string, (event: KeyboardEvent) => void];
export function useHotkeys(hotkeys: Item[]) {
  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      hotkeys.forEach(([hotkey, handler]) => {
        if (event.key === hotkey) {
          handler(event);
        }
      });
    };

    document.documentElement.addEventListener('keydown', keydownListener);
    return () =>
      document.documentElement.removeEventListener('keydown', keydownListener);
  }, [hotkeys]);
}
