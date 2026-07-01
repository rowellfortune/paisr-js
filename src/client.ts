import createClient, { type Client, type ClientOptions } from "openapi-fetch";
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
  /** Override the API base URL entirely, e.g. for a private/self-hosted deployment. */
  baseUrl?: string;
  /** Custom fetch implementation (useful for tests or non-standard runtimes). */
  fetch?: ClientOptions["fetch"];
}

export type PaisrClient = Client<paths>;

export function createPaisrClient(options: PaisrOptions): PaisrClient {
  if (!options.apiKey) {
    throw new Error("Paisr: `apiKey` is required.");
  }

  const baseUrl = options.baseUrl ?? BASE_URLS[options.environment ?? "live"];

  return createClient<paths>({
    baseUrl,
    fetch: options.fetch,
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
    },
  });
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

interface RawResult {
  data?: unknown;
  error?: unknown;
  response: Response;
}

/**
 * Unwraps an openapi-fetch result: throws `PaisrError` on failure, otherwise
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
