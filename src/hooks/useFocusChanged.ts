import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export function useFocusChanged(callback: (focus: boolean) => void) {
  useEffect(() => {
    const promise = getCurrentWindow().onFocusChanged(event => {
      callback(event.payload);
    });

    return () => {
      promise.then(unlisten => unlisten());
    };
  }, [callback]);
}
