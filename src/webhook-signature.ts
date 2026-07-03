/**
 * Verifies Paisr webhook signatures.
 *
 * Paisr signs webhook deliveries with `X-PCB-Signature` (HMAC-SHA256, hex-encoded)
 * over `${X-PCB-Timestamp}.${rawBody}`, using the webhook's signing secret
 * (see `paisr.webhooks.getSecret()` / `.rotateSecret()`).
 *
 * By default, deliveries older than 5 minutes are rejected to prevent replay attacks
 * (a captured, validly-signed payload being resent). Pass `toleranceSeconds: 0` to disable.
 *
 * @see https://docs.paisr.tech/v2/api/webhooks
 */

const DEFAULT_TOLERANCE_SECONDS = 300;

export interface VerifyWebhookSignatureOptions {
  /** The exact raw request body bytes/string as received — do not re-stringify a parsed object. */
  payload: string;
  /** Value of the `X-PCB-Signature` request header. */
  signature: string;
  /** Value of the `X-PCB-Timestamp` request header. */
  timestamp: string;
  /** The webhook's signing secret. */
  secret: string;
  /**
   * Maximum allowed age of `timestamp`, in seconds, before a delivery is treated as an
   * expired/replayed webhook. Defaults to 300 (5 minutes). Pass `0` to disable this check.
   */
  toleranceSeconds?: number;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Paisr's docs don't pin down whether `X-PCB-Timestamp` is second- or millisecond-precision,
 * so treat plausible Unix-seconds values (<=10 digits) as seconds and anything longer as ms.
 */
function timestampToMillis(timestamp: string): number | undefined {
  if (!/^\d+$/.test(timestamp)) return undefined;
  const value = Number(timestamp);
  if (!Number.isFinite(value)) return undefined;
  return timestamp.length <= 10 ? value * 1000 : value;
}

/** Returns `true` if the given webhook delivery has a valid, non-expired signature. */
export async function verifyWebhookSignature(options: VerifyWebhookSignatureOptions): Promise<boolean> {
  const { payload, signature, timestamp, secret, toleranceSeconds = DEFAULT_TOLERANCE_SECONDS } = options;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = toHex(digest);

  if (!timingSafeEqual(expected, signature)) return false;

  if (toleranceSeconds === 0) return true;

  const timestampMs = timestampToMillis(timestamp);
  if (timestampMs === undefined) return false;

  return Math.abs(Date.now() - timestampMs) <= toleranceSeconds * 1000;
}

/**
 * Verifies a webhook delivery and parses the payload as JSON.
 * Throws if the signature is invalid.
 */
export async function constructWebhookEvent<T = unknown>(options: VerifyWebhookSignatureOptions): Promise<T> {
  const valid = await verifyWebhookSignature(options);
  if (!valid) {
    throw new Error("Paisr: webhook signature verification failed.");
  }
  return JSON.parse(options.payload) as T;
}
