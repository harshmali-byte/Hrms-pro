import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchMeApi, loginApi, logoutApi, type AuthLoginResult } from "@/api/hrmsApi";
import { getAuthToken, setAuthToken } from "@/api/client";
import type { Role } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  employeeId: string | null;
}

interface AuthState {
  role: Role | null;
  user: AuthUser | null;
  token: string | null;
  isBootstrapping: boolean;
  /** Shown once after a fresh sign-in, not on stored-session restore */
  showPostLoginSplash: boolean;
  completePostLoginSplash: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [showPostLoginSplash, setShowPostLoginSplash] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await getAuthToken();
      if (!alive) return;
      if (!stored) {
        setIsBootstrapping(false);
        return;
      }
      setToken(stored);
      try {
        const { user: me } = await fetchMeApi();
        if (alive) setUser(me);
      } catch {
        await setAuthToken(null);
        if (alive) setToken(null);
      } finally {
        if (alive) setIsBootstrapping(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const applyLogin = useCallback((result: AuthLoginResult, fromFreshSignIn = false) => {
    setToken(result.token);
    setUser(result.user);
    void setAuthToken(result.token);
    if (fromFreshSignIn) setShowPostLoginSplash(true);
  }, []);

  const completePostLoginSplash = useCallback(() => {
    setShowPostLoginSplash(false);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const result = await loginApi(email.trim().toLowerCase(), password);
      applyLogin(result, true);
    },
    [applyLogin],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      /* clear local session even if API unreachable */
    }
    setUser(null);
    setToken(null);
    setShowPostLoginSplash(false);
    await setAuthToken(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      role: user?.role ?? null,
      user,
      token,
      isBootstrapping,
      showPostLoginSplash,
      completePostLoginSplash,
      signIn,
      signOut,
    }),
    [user, token, isBootstrapping, showPostLoginSplash, completePostLoginSplash, signIn, signOut],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
