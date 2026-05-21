import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Session = {
  userId: string;
  email: string;
  caskNumber: string;
};

type AuthState = {
  session: Session | null;
  signIn: (email: string) => void;
  signUp: (email: string) => void;
  signOut: () => void;
};

// Persisted demo auth — survives app restart. Phase 2 swaps to Supabase auth.
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      signIn: (email) =>
        set({
          session: {
            userId: 'demo-user',
            email,
            caskNumber: 'CASK 001',
          },
        }),
      signUp: (email) =>
        set({
          session: {
            userId: 'demo-user',
            email,
            caskNumber: 'CASK 001',
          },
        }),
      signOut: () => set({ session: null }),
    }),
    {
      name: 'trove-cellar:auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
