import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getMe,
  login as loginRequest,
  register as registerRequest,
} from "../services/auth";
import { SESSION_EXPIRED } from "../services/api";
import { User, UserRole } from "../utils/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("token");
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => sessionStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const expire = () => {
      sessionStorage.removeItem("token");
      setUser(null);
    };
    window.addEventListener(SESSION_EXPIRED, expire);
    return () => window.removeEventListener(SESSION_EXPIRED, expire);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!user || !token) return;
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      const remaining = payload.exp * 1000 - Date.now();
      if (remaining <= 0) {
        logout();
        return;
      }
      const timer = window.setTimeout(logout, Math.min(remaining, 2147483647));
      return () => window.clearTimeout(timer);
    } catch {
      logout();
    }
  }, [user]);

  async function login(email: string, password: string) {
    const result = await loginRequest(email, password);
    sessionStorage.setItem("token", result.token);
    setUser(result.user);
    return result.user;
  }

  async function register(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    const result = await registerRequest(name, email, password, role);
    sessionStorage.setItem("token", result.token);
    setUser(result.user);
    return result.user;
  }

  function logout() {
    sessionStorage.removeItem("token");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
