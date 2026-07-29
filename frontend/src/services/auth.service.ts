import { api } from "@/lib/api-client";

export const authService = {
  login: (email: string, password: string) =>
    api.post<any>("/auth/user/login", {
      email,
      password,
      userAgent: navigator.userAgent,
      deviceName: "Chrome on Windows",
      clientType: "web",
      deviceId: crypto.randomUUID(),
      executionMode: "PUBLISH",
    }),

  getUserAccountMapping: () =>
    api.get<any>("/auth/user-account-mapping/"),

  switchAccount: (accountId: string) =>
    api.post<any>("/auth/sessions/switch-account", {
      accountId,
      executionMode: "PUBLISH",
    }),

  getAccountSettings: (marketplace = "all") =>
    api.get<any>(`/auth/settings/account?marketplace=${marketplace}`),
};
