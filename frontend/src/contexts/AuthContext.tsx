import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("anarix_auth_token")
  );
  const [user, setUser] = useState<any | null>(() => {
    const stored = localStorage.getItem("anarix_auth_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loginRes = await authService.login(email, password);
      const jwt = loginRes.data?.authToken;

      if (!jwt) {
        throw new Error("No token in login response");
      }

      localStorage.setItem("anarix_auth_token", jwt);
      if (loginRes.data?.user) {
        localStorage.setItem("anarix_auth_user", JSON.stringify(loginRes.data.user));
      }

      setToken(jwt);
      setUser(loginRes.data?.user || null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("anarix_auth_token");
    localStorage.removeItem("anarix_auth_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
