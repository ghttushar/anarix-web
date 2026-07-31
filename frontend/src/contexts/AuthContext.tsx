import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/services/auth.service";
import type {
  AuthUser,
  AuthAccount,
  AuthenticateResponseData,
  UserAccountMapping,
} from "@/services/auth.service";
import { accountStorage } from "@/lib/account-storage";

const TOKEN_KEY = "anarix_auth_token";
const USER_KEY = "anarix_auth_user";
const ACCOUNT_KEY = "anarix_account_details";
const MAPPED_ACCOUNTS_KEY = "anarix_mapped_accounts";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  account: AuthAccount | null;
  mappedAccounts: UserAccountMapping[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<{ authToken: string; user: AuthUser; requiresAccountSelection: boolean }>;
  logout: (navigateToLogin?: boolean) => Promise<void>;
  switchAccount: () => Promise<void>;
  setAccount: (account: AuthAccount | null) => void;
  setMappedAccounts: (mappedAccounts: UserAccountMapping[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

function readStoredUser(): AuthUser | null {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

function readStoredAccount(): AuthAccount | null {
  const stored = localStorage.getItem(ACCOUNT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthAccount;
  } catch {
    return null;
  }
}

function readStoredMappedAccounts(): UserAccountMapping[] {
  const stored = localStorage.getItem(MAPPED_ACCOUNTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as UserAccountMapping[];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [account, setAccountState] = useState<AuthAccount | null>(readStoredAccount);
  const [mappedAccounts, setMappedAccountsState] = useState<UserAccountMapping[]>(readStoredMappedAccounts);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const loginRes = await authService.login(email, password);
        const jwt = loginRes.data?.authToken;

        if (!jwt) {
          throw new Error("No token in login response");
        }

        localStorage.setItem(TOKEN_KEY, jwt);
        if (loginRes.data?.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(loginRes.data.user));
        }

        setToken(jwt);
        setUser(loginRes.data?.user || null);

        return loginRes.data;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const setAccount = useCallback((nextAccount: AuthAccount | null) => {
    setAccountState(nextAccount);
    if (nextAccount) {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextAccount));
      localStorage.setItem("anarix_account_id", nextAccount._id);
    } else {
      localStorage.removeItem(ACCOUNT_KEY);
      localStorage.removeItem("anarix_account_id");
    }
  }, []);

  const setMappedAccounts = useCallback((nextMappedAccounts: UserAccountMapping[]) => {
    setMappedAccountsState(nextMappedAccounts);
    localStorage.setItem(MAPPED_ACCOUNTS_KEY, JSON.stringify(nextMappedAccounts));
  }, []);

  const logout = useCallback(async (navigateToLogin = true) => {
    if (navigateToLogin) {
      try {
        await authService.logout();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.removeItem(MAPPED_ACCOUNTS_KEY);
    localStorage.removeItem("anarix_account_id");
    accountStorage.clearAccountState();
    setToken(null);
    setUser(null);
    setAccountState(null);
    setMappedAccountsState([]);
    if (navigateToLogin) {
      window.location.href = "/login";
    }
  }, []);

  const switchAccount = useCallback(async () => {
    if (!user || !token) return;
    try {
      await authService.leaveAccount();
    } catch (error) {
      console.error("Error during leave account:", error);
    }
    await logout(false);
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
    setUser(user);
    window.location.href = "/select-account";
  }, [user, token, logout]);

  useEffect(() => {
    const authenticateUser = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) return;

      setIsAuthenticating(true);
      try {
        const res = await authService.authenticate();
        const data: AuthenticateResponseData = res.data;

        if (data?.user?.shouldLogout) {
          await logout(true);
          return;
        }

        if (data?.isAuthenticated && data.user) {
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    authenticateUser();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        account,
        mappedAccounts,
        isAuthenticated: !!token,
        isLoading,
        isAuthenticating,
        login,
        logout,
        switchAccount,
        setAccount,
        setMappedAccounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
