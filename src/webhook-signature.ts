/**
 * Verifies Paisr webhook signatures.
 *
 * Paisr signs webhook deliveries with `X-PCB-Signature` (HMAC-SHA256, hex-encoded)
 * over `${X-PCB-Timestamp}.${rawBody}`, using the webhook's signing secret
 * (see `paisr.webhooks.getSecret()` / `.rotateSecret()`).
 *
 * @see https://docs.paisr.tech/v2/api/webhooks
 */

export interface VerifyWebhookSignatureOptions {
  /** The exact raw request body bytes/string as received — do not re-stringify a parsed object. */
  payload: string;
  /** Value of the `X-PCB-Signature` request header. */
  signature: string;
  /** Value of the `X-PCB-Timestamp` request header. */
  timestamp: string;
  /** The webhook's signing secret. */
  secret: string;
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

/** Returns `true` if the given webhook delivery has a valid signature. */
export async function verifyWebhookSignature(options: VerifyWebhookSignatureOptions): Promise<boolean> {
  const { payload, signature, timestamp, secret } = options;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = toHex(digest);

  return timingSafeEqual(expected, signature);
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
