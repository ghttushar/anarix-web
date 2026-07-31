import { accountStorage } from "./account-storage";

const BASE_URL = import.meta.env.VITE_API_URL || "https://api.dev.anarix.ai/api";
const LOGIN_URL = "/login";
const SELECT_ACCOUNT_URL = "/select-account";

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  error: boolean;
  message: string;
  description?: string;
  data: T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public description?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ExtraHeaders = Record<string, string>;

/* ── URL classification (mirrors old repo request.utils.ts) ── */

const startsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((prefix) => path.startsWith(prefix));

const AMAZON_PREFIXES = [
  "/advertising/v2/amazon",
  "/advertising/amazon",
  "/advertising/v2/impact-analysis/amazon",
  "/amc",
  "/bidder",
  "/advertising/settings",
  "/advertising/reports/embed/access-token",
  "/advertising/amazon/ads",
  "/advertising/amazon/sp",
  "/jiva-llm",
  "/advertising/v2/amazon/edit-logs",
  "/advertising/v2/amazon/edit",
  "/targeting-action/amazon",
  "/advertising/v2/tags",
];

const WALMART_PREFIXES = [
  "/advertising/v2/walmart",
  "/advertising/walmart",
  "/advertising/v2/impact-analysis/walmart",
  "/bidder",
  "/advertising/settings",
  "/advertising/reports/embed/access-token",
  "/jiva-llm",
  "/advertising/v2/walmart/edit-logs",
  "/advertising/v2/walmart/edit",
  "/day-parting/jobs/walmart",
  "/auth/account/walmart",
  "/targeting-action/walmart",
  "/advertising/v2/tags",
];

const AMAZON_DAYPARTING_PREFIXES = ["/day-parting/jobs"];

const WALMART_CATALOG_PREFIXES = [
  "/advertising/v2/walmart/catalog",
  "/advertising/v2/walmart/profitability",
];

const AMAZON_CATALOG_PREFIXES = [
  "/amazon-ads/catalog",
  "/advertising/v2/amazon/profitability",
];

const AMC_PREFIX = "/amc";

const RULES_PREFIX = "/rules";

const AMAZON_PROFITABILITY_PREFIX = "/advertising/v2/amazon/profitability";

const checkIsAmazonUrl = (path: string) => startsWithAny(path, AMAZON_PREFIXES);

const checkIsWalmartUrl = (path: string) => startsWithAny(path, WALMART_PREFIXES);

const checkIsAmazonDaypartingUrl = (path: string) =>
  startsWithAny(path, AMAZON_DAYPARTING_PREFIXES);

const checkIsWalmartCatalogUrl = (path: string) =>
  startsWithAny(path, WALMART_CATALOG_PREFIXES);

const checkIsAmazonCatalogUrl = (path: string) =>
  startsWithAny(path, AMAZON_CATALOG_PREFIXES);

const checkIsAmcUrl = (path: string) => path.startsWith(AMC_PREFIX);

const checkIsRulesUrl = (path: string) => path.startsWith(RULES_PREFIX);

const checkIsAmazonProfitability = (path: string) =>
  path.startsWith(AMAZON_PROFITABILITY_PREFIX);

/* ── Platform-specific header injection ── */

function buildPlatformHeaders(path: string): ExtraHeaders {
  const headers: ExtraHeaders = {};
  const selectedAdvertisingAccount =
    accountStorage.getSelectedAdvertisingAccount();
  const selectedCatalogAccount = accountStorage.getSelectedCatalogAccount();
  const selectedAMCInstance = accountStorage.getSelectedAMCInstance();
  const selectedDSPAccount = accountStorage.getSelectedDSPAccount();

  const isWalmart =
    checkIsWalmartUrl(path) ||
    checkIsWalmartCatalogUrl(path) ||
    checkIsRulesUrl(path);

  const isAmazon =
    checkIsAmazonUrl(path) ||
    checkIsAmazonDaypartingUrl(path) ||
    checkIsRulesUrl(path) ||
    checkIsAmazonCatalogUrl(path);

  if (isWalmart) {
    const walmartAdvertiserId =
      selectedAdvertisingAccount?.advertising?.walmartAdvertiserId;
    if (walmartAdvertiserId) {
      headers["walmartadvertiserid"] = walmartAdvertiserId;
    }
  }

  if (isAmazon) {
    const amazonProfileId =
      selectedAdvertisingAccount?.advertising?.amazonProfileId;
    if (amazonProfileId) {
      headers["amazonProfileId"] = amazonProfileId;
    }
  }

  if (checkIsWalmartCatalogUrl(path)) {
    const partnerId = selectedCatalogAccount?.catalog?.partnerId;
    if (partnerId) {
      headers["walmartpartnerid"] = partnerId;
    }
  }

  if (checkIsAmazonCatalogUrl(path)) {
    const partnerId = selectedCatalogAccount?.catalog?.partnerId;
    if (partnerId) {
      headers["sellingpartnerid"] = partnerId;
    }
  }

  if (checkIsAmcUrl(path)) {
    const instanceId = selectedAMCInstance?.value;
    const dspAdvertiserId = selectedDSPAccount?.advertiserId;
    if (instanceId) {
      headers["instanceId"] = instanceId;
    }
    if (dspAdvertiserId) {
      headers["dspAdvertiserId"] = dspAdvertiserId;
    }
  }

  return headers;
}

/* ── Request/response handling ── */

const AUTH_KEYS = ["anarix_auth_token", "anarix_auth_user", "authToken"];

function clearAuthState() {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  accountStorage.clearAccountState();
}

function redirectTo(url: string, delay = 1000) {
  if (window.location.pathname === url) return;
  setTimeout(() => {
    window.location.href = url;
  }, delay);
}

function handleUnauthorized() {
  clearAuthState();
  redirectTo(LOGIN_URL);
}

function handleTokenInvalidation() {
  redirectTo(SELECT_ACCOUNT_URL);
}

function injectBody(path: string, body: unknown): unknown {
  if (body === undefined || body === null) return body;

  if (body instanceof FormData) {
    if (!body.has("executionMode")) {
      body.append("executionMode", "PUBLISH");
    }
    return body;
  }

  let parsed: Record<string, unknown>;
  if (typeof body === "string") {
    try {
      parsed = JSON.parse(body) as Record<string, unknown>;
    } catch {
      return body;
    }
  } else {
    parsed = { ...(body as Record<string, unknown>) };
  }

  parsed = { ...parsed, executionMode: "PUBLISH" };

  if (checkIsAmazonProfitability(path)) {
    parsed = { ...parsed, version: "v1" };
  }

  return JSON.stringify(parsed);
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  extraHeaders?: ExtraHeaders;
};

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const token =
    localStorage.getItem("anarix_auth_token") || accountStorage.getAuthToken();

  const headers: ExtraHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...buildPlatformHeaders(path),
    ...(options?.extraHeaders || {}),
  };

  const body = injectBody(path, options?.body);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: body as BodyInit | undefined,
  });

  const text = await res.text();
  let envelope: ApiEnvelope<T> | null = null;
  if (text) {
    try {
      envelope = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      envelope = null;
    }
  }

  if (res.status === 401) {
    handleUnauthorized();
  } else if (res.status === 409) {
    handleTokenInvalidation();
  }

  if (res.status === 204 || !envelope) {
    if (!res.ok) {
      throw new ApiError(res.status, text || res.statusText);
    }
    return undefined as T;
  }

  if (!res.ok || res.status === 207 || envelope.error === true) {
    throw new ApiError(
      res.status,
      envelope.message || res.statusText || `Request failed (${res.status})`,
      envelope.description,
      envelope.data
    );
  }

  return envelope as T;
}

export const api = {
  get: <T>(path: string, extraHeaders?: ExtraHeaders) =>
    request<T>(path, { method: "GET", extraHeaders }),
  post: <T>(path: string, body?: BodyInit | Record<string, unknown> | null, extraHeaders?: ExtraHeaders) =>
    request<T>(path, { method: "POST", body, extraHeaders }),
  put: <T>(path: string, body?: BodyInit | Record<string, unknown> | null, extraHeaders?: ExtraHeaders) =>
    request<T>(path, { method: "PUT", body, extraHeaders }),
  delete: <T>(path: string, extraHeaders?: ExtraHeaders) =>
    request<T>(path, { method: "DELETE", extraHeaders }),
};

export { BASE_URL, LOGIN_URL, SELECT_ACCOUNT_URL };
