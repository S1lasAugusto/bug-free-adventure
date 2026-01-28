import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { api } from "../utils/api";

interface User {
  id: string;
  name: string;
  email: string | null;
  onBoarded: boolean;
  protusId?: string | null;
  USNEmail?: string | null;
  role?: "USER" | "ADMIN";
  group?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loginMutation = api.auth.login.useMutation();
  const registerMutation = api.auth.register.useMutation();
  const meMutation = api.auth.me.useMutation();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      meMutation.mutate(undefined, {
        onSuccess: (userData: User) => {
          setUser(userData);
          setIsLoading(false);
        },
        onError: () => {
          localStorage.removeItem("auth-token");
          setIsLoading(false);
        },
      });
    } else {
      setIsLoading(false);
    }
  }, []); // Removed meMutation dependency to prevent infinite loop

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      localStorage.setItem("auth-token", result.token);
      setUser(result.user);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await registerMutation.mutateAsync({
        name,
        email,
        password,
      });
      localStorage.setItem("auth-token", result.token);
      setUser(result.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
