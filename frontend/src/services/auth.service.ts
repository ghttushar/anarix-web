import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  LoginResponseData,
  AccountMappingItem,
  AccountSettingsEntry,
} from "@/types/profitability";

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<LoginResponseData>>("/auth/user/login", {
      email,
      password,
      userAgent: navigator.userAgent,
      deviceName: "Chrome on Windows",
      clientType: "web",
      deviceId: crypto.randomUUID(),
      executionMode: "PUBLISH",
    }),

  getUserAccountMapping: () =>
    api.get<ApiResponse<AccountMappingItem[]>>("/auth/user-account-mapping/"),

  switchAccount: (accountId: string) =>
    api.post<ApiResponse<{ currentAccountId: string }>>("/auth/sessions/switch-account", {
      accountId,
      executionMode: "PUBLISH",
    }),

  getAccountSettings: (marketplace = "all") =>
    api.get<ApiResponse<AccountSettingsEntry[]>>(`/auth/settings/account?marketplace=${marketplace}`),
};
