import { create } from 'zustand';

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

// In-session demo auth (Phase 1). Supabase auth wires in Phase 2.
export const useAuth = create<AuthState>((set) => ({
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
}));
