import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import { removeStorage, readStorage, writeStorage } from "../../lib/storage";
import type { AuthUser } from "../../types/auth";

const AUTH_STORAGE_KEY = "event-booking-auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => readStorage<AuthUser | null>(AUTH_STORAGE_KEY, null));

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (email: string) => {
        const nextUser: AuthUser = {
          email,
          loggedInAt: new Date().toISOString(),
        };
        setUser(nextUser);
        writeStorage(AUTH_STORAGE_KEY, nextUser);
      },
      logout: () => {
        setUser(null);
        removeStorage(AUTH_STORAGE_KEY);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
