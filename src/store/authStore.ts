import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Session {
  user: User;
  token: string;
}

interface AuthState {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        session: null,
        login: (session) => {
          set({ session });
        },
        logout: () => {
          set({ session: null });
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
