# paisr-js

A typed JavaScript/TypeScript client for the [Paisr API](https://github.com/paisrtechnologies/pcb-openapi) — wallets, transfers, customers, vouchers, plans, invoices, subscriptions, payments, provider connections, webhooks, and access tokens.

Built on [`axios`](https://axios-http.com/) with types generated from Paisr's OpenAPI spec via [`openapi-typescript`](https://github.com/openapi-ts/openapi-typescript). Works in Node.js 18+ and in the browser.

## Install

```bash
npm install paisr-js
```

## Usage

```ts
import { Paisr } from "paisr-js";

const paisr = new Paisr({
  apiKey: process.env.PAISR_API_KEY!,
  environment: "live", // or "staging" (defaults to "live")
});

// List wallets
const { wallets } = await paisr.wallets.list();

// Create a wallet
const created = await paisr.wallets.create({
  type: "business",
  currency: "USD",
});

// Nested wallet resources
const balances = await paisr.wallets.balances.list(created.id);
const transactions = await paisr.wallets.transactions.list(created.id, { limit: 25 });
await paisr.wallets.pin.rotate(created.id);

// Customers, invoices, subscriptions, payments...
const customer = await paisr.customers.add({ email: "jane@example.com" });
const invoice = await paisr.invoices.create({ customer_id: customer.id });
await paisr.invoices.send(invoice.id);

const payment = await paisr.payments.initiate("card", {
  amount: 5000,
  currency: "USD",
});
```

### Error handling

Every non-2xx response throws a `PaisrError` with the HTTP status and parsed response body attached:

```ts
import { Paisr, PaisrError } from "paisr-js";

try {
  await paisr.wallets.get("does-not-exist");
} catch (err) {
  if (err instanceof PaisrError) {
    console.error(err.status, err.message, err.body);
  }
}
```

### Custom base URL / axios instance

```ts
const paisr = new Paisr({
  apiKey: "...",
  baseUrl: "https://api.staging.paisr.tech/v2", // overrides `environment`
  axiosInstance: myAxiosInstance, // e.g. for retries, proxying, or testing
});
```

`baseUrl` must be `https://` — a non-`https://` value throws unless you pass `allowInsecureBaseUrl: true` (e.g. for local proxying against a plain-HTTP dev server).

### Per-request headers (e.g. idempotency keys)

Every client method accepts a `headers` option, forwarded as-is on that request:

```ts
await paisr.payments.initiate(
  "wallet",
  { invoice_id, ... },
  { headers: { "Idempotency-Key": crypto.randomUUID() } },
);
```

Use this to attach an idempotency key on retried payment/transfer-creating calls, if the target Paisr environment supports one.

### Verifying webhook signatures

Paisr signs each webhook delivery with an `X-PCB-Signature` header (HMAC-SHA256 over `${X-PCB-Timestamp}.${rawBody}`, keyed with the webhook's signing secret — see `paisr.webhooks.getSecret()`). Use `constructWebhookEvent` to verify and parse a delivery in one step:

```ts
import { constructWebhookEvent } from "paisr-js";

// e.g. inside an Express/Fastify/Hono handler — verify against the *raw* request body,
// not a re-serialized parsed object, or the signature check will fail.
const event = await constructWebhookEvent({
  payload: rawBody, // string
  signature: req.header("X-PCB-Signature")!,
  timestamp: req.header("X-PCB-Timestamp")!,
  secret: process.env.PAISR_WEBHOOK_SECRET!,
});
```

Or call `verifyWebhookSignature({ payload, signature, timestamp, secret })` directly if you just need a boolean.

By default, deliveries older than 5 minutes are rejected as expired/replayed webhooks. Pass `toleranceSeconds: 0` to disable this check, or a different value to widen/narrow the window.

## Security notes

- **Raw card data (`payments.initiate("card", ...)`)**: this method requires a raw card number and CVV/CVC in `card_details`. Collecting and forwarding that data yourself puts your own systems in full PCI DSS scope (SAQ D). Prefer a hosted/tokenized card entry flow if Paisr offers one.
- **Webhook replay protection**: `verifyWebhookSignature`/`constructWebhookEvent` reject deliveries whose `X-PCB-Timestamp` is more than 5 minutes old by default — see above to adjust.
- **Transport security**: if you override `baseUrl` with a non-`https://` URL, the SDK logs a warning, since your API key and any payment data would otherwise be sent unencrypted.
- **Timeouts**: the default axios instance uses a 30s request timeout; pass your own `axiosInstance` to customize.

## Resources

| Namespace | Covers |
| --- | --- |
| `paisr.accessTokens` | Access tokens & their permissions |
| `paisr.webhooks` | Webhooks, secrets, triggers, delivery events |
| `paisr.wallets` | Wallets, plus nested `.pin`, `.statements`, `.transactions`, `.balances`, `.accounts`, `.contacts`, `.links` |
| `paisr.transfers` | Initiate/approve/cancel transfers, batch transfers |
| `paisr.customers` | Customers |
| `paisr.vouchers` | Vouchers, applying voucher codes |
| `paisr.plans` | Plans, plus nested `.options` (price options) |
| `paisr.invoices` | Invoices, plus nested `.line_items` |
| `paisr.subscriptions` | Subscriptions, restore/cancel |
| `paisr.payments` | Payments, refunds |
| `paisr.providers` | Provider connections |
| `paisr.metrics` | Invoice/subscription/payment/customer metrics |
| `paisr.logs` | API request logs |

All request/response types are generated directly from Paisr's OpenAPI spec (vendored at `src/spec/paisr.yaml`), so method signatures stay in sync with the API surface.

## Development

```bash
npm install
npm run generate   # regenerate src/generated/types.ts from src/spec/paisr.yaml
npm run typecheck
npm run build       # outputs ESM + CJS + .d.ts to dist/
```

To pick up API changes, replace `src/spec/paisr.yaml` with the latest spec and re-run `npm run generate`.
