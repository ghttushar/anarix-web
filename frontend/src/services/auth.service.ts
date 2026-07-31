import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  LoginResponseData,
  AccountMappingItem,
  AccountSettingsEntry,
} from "@/types/profitability";

export interface AuthUser {
  email: string;
  _id: string;
  isSuperAdmin: boolean;
  firstName: string;
  lastName: string;
  shouldLogout: boolean;
  hasAccess: Array<{ type: string; scope: string }>;
  userType: string;
}

export interface AuthAccount {
  _id: string;
  brandName: string;
  anarixId?: string;
  powerBiGroupId?: string;
  powerBiReportId?: string;
  brandNameVariations?: Array<{ brandName: string; channels: string[]; isPrimary: boolean }>;
  isDemoAccount?: boolean;
  enabledFeatures?: string[];
  disabledFeatures?: string[];
  marketplace?: string;
  accountType?: string;
  countryCode?: string;
}

export interface UserAccountMapping {
  _id: string;
  userId: string;
  accountId: AuthAccount;
  roles: string[];
  permissions: string[];
  enabledFeatures?: string[];
  disabledFeatures?: string[];
  featuresUnderMaintenance?: string[];
  isPinned?: boolean;
}

export interface AuthenticateResponseData {
  isAuthenticated: boolean;
  user: AuthUser;
}

export interface DSPAdvertiserAccount {
  accountId: string;
  agencyProfileId?: string;
  advertiserId: string;
  name: string;
  country?: string;
  currency?: string;
  timezone?: string;
  isRegional?: boolean;
}

function getDeviceContext() {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "Unknown";
  const name = /Mac/.test(platform)
    ? "Mac"
    : /Windows/.test(platform)
      ? "Windows"
      : /Linux/.test(platform)
        ? "Linux"
        : platform;
  return {
    userAgent: ua,
    deviceName: `${name} (${navigator.language || "en-US"})`,
    clientType: "web",
    deviceId: localStorage.getItem("anarix_device_id") || crypto.randomUUID(),
  };
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<LoginResponseData>>("/auth/user/login", {
      email,
      password,
      ...getDeviceContext(),
    }),

  authenticate: () =>
    api.get<ApiResponse<AuthenticateResponseData>>("/auth/user/authenticate"),

  verifyEmail: (token: string) =>
    api.get<ApiResponse<LoginResponseData>>(`/auth/user/verify/${token}`, undefined, {
      ...getDeviceContext(),
    }),

  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    brandName: string;
    password: string;
  }) => api.post<ApiResponse<AuthenticateResponseData>>("/auth/user/register", body),

  forgotPasswordEmail: (email: string) =>
    api.post<ApiResponse<null>>("/auth/user/forgot-password/email", { email }),

  forgotPassword: (token: string, password: string) =>
    api.post<ApiResponse<null>>(`/auth/user/forgot-password/${token}`, { password }),

  getAccount: (accountId: string) =>
    api.get<ApiResponse<AuthAccount>>(`/auth/account/${accountId}`),

  getUserAccountMapping: () =>
    api.get<ApiResponse<AccountMappingItem[]>>("/auth/user-account-mapping/"),

  inviteUser: (body: { email: string; role: string }) =>
    api.post<ApiResponse<null>>("/auth/user/invite", body),

  registerInvitedUser: (token: string, body: { firstName: string; lastName: string; password: string }) =>
    api.post<ApiResponse<null>>(`/auth/user/register-invited/${token}`, body),

  acceptInvite: (token: string) =>
    api.get<ApiResponse<null>>(`/auth/user/invite/accept/${token}`),

  inviteDetails: (token: string) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/auth/user/invite/details/${token}`),

  getInviteList: () => api.get<ApiResponse<Record<string, unknown>[]>>("/auth/user/invite/list"),

  getUserList: () => api.get<ApiResponse<Record<string, unknown>[]>>("/auth/user/list"),

  revokeAccessByUserId: (userId: string) =>
    api.delete<ApiResponse<null>>(`/auth/user/access/revoke/${userId}`),

  deleteInviteByInviteId: (inviteId: string) =>
    api.delete<ApiResponse<null>>(`/auth/user/invite/${inviteId}`),

  updateUserRole: (body: { userId: string; role: string }) =>
    api.put<ApiResponse<null>>("/auth/account/user/role", body),

  updateIsPinned: (accountId: string, isPinned: boolean) =>
    api.put<ApiResponse<AccountMappingItem>>("/auth/user-account-mapping", {
      isPinned,
      accountId,
    }),

  switchAccount: (accountId: string) =>
    api.post<ApiResponse<null>>("/auth/sessions/switch-account", { accountId }),

  leaveAccount: () =>
    api.post<ApiResponse<null>>("/auth/sessions/leave-account"),

  logout: () => api.post<ApiResponse<null>>("/auth/sessions/logout"),

  getAccountSettings: (marketplace = "all") =>
    api.get<ApiResponse<AccountSettingsEntry[]>>(`/auth/settings/account?marketplace=${marketplace}`),

  getDSPAccount: () =>
    api.get<ApiResponse<DSPAdvertiserAccount[]>>("/auth/account/amazon/dsp/account"),
};
