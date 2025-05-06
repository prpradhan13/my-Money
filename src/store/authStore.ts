import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../utils/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetUserDetails } from "../utils/query/userQuery";

interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isAuthenticated: false,

      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const initializeAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  useAuthStore.getState().setSession(session);

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session);
  });
};

export default useAuthStore;
