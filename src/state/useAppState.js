import { useContext } from 'react';
import { AppContext } from './context';

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside <AppStateProvider>');
  }
  return ctx;
}

export default useAppState;
