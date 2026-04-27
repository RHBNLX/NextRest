import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Hook to set the page title dynamically on web
 * Usage: usePageTitle('Oldalcím')
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = `${title} - Nextrest`;
    }
  }, [title]);
}
