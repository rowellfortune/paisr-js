import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { paths } from "./generated/types.js";

export type PaisrEnvironment = "live" | "staging";

const BASE_URLS: Record<PaisrEnvironment, string> = {
  live: "https://api.live.paisr.tech/v2",
  staging: "https://api.staging.paisr.tech/v2",
};

export interface PaisrOptions {
  /** Bearer access token issued by Paisr (Settings -> Access Tokens). */
  apiKey: string;
  /** Which Paisr environment to talk to. Defaults to "live". Ignored if `baseUrl` is set. */
  environment?: PaisrEnvironment;
  /**
   * Override the API base URL entirely, e.g. for a private/self-hosted deployment.
   * Must be `https://` unless `allowInsecureBaseUrl` is set — your API key and any card
   * data would otherwise be sent unencrypted.
   */
  baseUrl?: string;
  /**
   * Allow a non-`https://` `baseUrl` (e.g. for local proxying/testing against a plain-HTTP
   * dev server). Off by default: without this, a non-`https://` `baseUrl` throws instead of
   * silently sending your API key and any card data unencrypted.
   */
  allowInsecureBaseUrl?: boolean;
  /**
   * Custom axios instance (useful for tests, proxying, or adding interceptors).
   * When omitted, the default instance uses a 30s request timeout.
   */
  axiosInstance?: AxiosInstance;
}

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

/** Paths in the spec that support a given HTTP method. */
type PathsWithMethod<M extends HttpMethod> = {
  [K in keyof paths]: M extends keyof paths[K] ? K : never;
}[keyof paths];

interface RequestOptions {
  params?: {
    path?: Record<string, string | number>;
    query?: Record<string, unknown> | undefined;
  };
  body?: unknown;
  /**
   * Extra headers for this request, e.g. `{ "Idempotency-Key": "..." }` to guard a
   * payment/transfer-creating call against duplicate execution on retry, if/when the
   * target Paisr API supports it. Merged over (and can override) the client's default headers.
   */
  headers?: Record<string, string>;
}

export interface RawResult {
  data?: unknown;
  error?: unknown;
  response: AxiosResponse;
}

export interface PaisrClient {
  GET<P extends PathsWithMethod<"get">>(url: P, options?: RequestOptions): Promise<RawResult>;
  POST<P extends PathsWithMethod<"post">>(url: P, options?: RequestOptions): Promise<RawResult>;
  PUT<P extends PathsWithMethod<"put">>(url: P, options?: RequestOptions): Promise<RawResult>;
  PATCH<P extends PathsWithMethod<"patch">>(url: P, options?: RequestOptions): Promise<RawResult>;
  DELETE<P extends PathsWithMethod<"delete">>(url: P, options?: RequestOptions): Promise<RawResult>;
}

function interpolatePath(url: string, pathParams?: Record<string, string | number>): string {
  if (!pathParams) return url;
  return url.replace(/\{([^}]+)\}/g, (match, key: string) => {
    const value = pathParams[key];
    return value === undefined ? match : encodeURIComponent(String(value));
  });
}

async function request(
  instance: AxiosInstance,
  method: HttpMethod,
  url: string,
  options: RequestOptions = {},
): Promise<RawResult> {
  const path = interpolatePath(url, options.params?.path);

  try {
    const response = await instance.request({
      url: path,
      method,
      params: options.params?.query,
      data: options.body,
      headers: options.headers,
    });
    return { data: response.data, error: undefined, response };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return { data: undefined, error: err.response.data, response: err.response };
    }
    throw err;
  }
}

export function createPaisrClient(options: PaisrOptions): PaisrClient {
  if (!options.apiKey) {
    throw new Error("Paisr: `apiKey` is required.");
  }

  const baseUrl = options.baseUrl ?? BASE_URLS[options.environment ?? "live"];

  if (!baseUrl.startsWith("https://") && !options.allowInsecureBaseUrl) {
    throw new Error(
      `Paisr: baseUrl "${baseUrl}" is not https — your API key and any payment data would be sent ` +
        `unencrypted. Pass \`allowInsecureBaseUrl: true\` if this is intentional (e.g. local proxying).`,
    );
  }

  const instance =
    options.axiosInstance ??
    axios.create({
      baseURL: baseUrl,
      timeout: 30_000,
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
      },
    });

  return {
    GET: (url, opts) => request(instance, "get", url, opts),
    POST: (url, opts) => request(instance, "post", url, opts),
    PUT: (url, opts) => request(instance, "put", url, opts),
    PATCH: (url, opts) => request(instance, "patch", url, opts),
    DELETE: (url, opts) => request(instance, "delete", url, opts),
  };
}

/** Thrown for any non-2xx response from the Paisr API. */
export class PaisrError extends Error {
  /** HTTP status code of the failed response. */
  readonly status: number;
  /** Parsed error response body, if any. */
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "PaisrError";
    this.status = status;
    this.body = body;
  }
}

interface Envelope {
  success?: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Unwraps a Paisr client result: throws `PaisrError` on failure, otherwise
 * returns the inner `data` payload of Paisr's `{ success, data }` envelope
 * (or the whole envelope for endpoints that only return `{ success, message }`).
 */
export async function unwrap(resultPromise: Promise<RawResult>): Promise<any> {
  const { data, error, response } = await resultPromise;

  if (error !== undefined) {
    const body = error as Envelope | undefined;
    throw new PaisrError(
      body?.message ?? `Paisr API request failed with status ${response.status}`,
      response.status,
      error,
    );
  }

  const envelope = data as Envelope | undefined;
  if (envelope && typeof envelope === "object" && "data" in envelope) {
    return envelope.data;
  }
  return envelope;
}