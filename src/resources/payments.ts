import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { components, paths } from "../generated/types.js";

/** Options for a single request, e.g. an idempotency key to guard against duplicate execution on retry. */
interface CallOptions {
  headers?: Record<string, string>;
}

type ListPaymentsQuery = paths["/payments"]["get"]["parameters"]["query"];
type RefundPaymentBody =
  NonNullable<paths["/payments/{payment_id}/refund"]["post"]["requestBody"]>["content"]["application/json"];

/** Maps each payment method to the request body shape it requires. */
interface InitiatePaymentBodyMap {
  wallet: components["schemas"]["PostInitiateWalletPaymentRequest"];
  qr: components["schemas"]["PostInitiateQrPaymentRequest"];
  card: components["schemas"]["PostInitiateCardPaymentRequest"];
  bank: components["schemas"]["PostInitiateBankPaymentRequest"];
}

export class PaymentsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of payments, optionally filtered by resource, currency, status, or method. */
  list(query?: ListPaymentsQuery) {
    return unwrap(this.client.GET("/payments", { params: { query } }));
  }

  /**
   * Initiate a payment using the given method ("bank", "wallet", "qr", or "card").
   * The required fields in `body` depend on `method` (e.g. "bank" requires `swift_code`,
   * "card" requires `card_details`) — the type parameter enforces the matching shape.
   *
   * Security note: the `"card"` method requires the raw card number and CVV/CVC in
   * `card_details`. Collecting and forwarding that data yourself brings your own systems
   * into full PCI DSS scope (SAQ D). Prefer a hosted/tokenized card entry flow if Paisr
   * offers one, rather than handling raw PANs directly.
   *
   * Pass `options.headers` (e.g. `{ "Idempotency-Key": ... }`) to guard against a retried
   * call initiating a duplicate payment.
   */
  initiate<M extends keyof InitiatePaymentBodyMap>(method: M, body: InitiatePaymentBodyMap[M], options?: CallOptions) {
    return unwrap(
      this.client.POST("/payments/initiate/{method}", {
        params: { path: { method } },
        body,
        headers: options?.headers,
      }),
    );
  }

  /** Fetch a single payment. */
  get(paymentId: string) {
    return unwrap(this.client.GET("/payments/{payment_id}", { params: { path: { payment_id: paymentId } } }));
  }

  /**
   * Refund a payment, in full or in part.
   *
   * Pass `options.headers` (e.g. `{ "Idempotency-Key": ... }`) to guard against a retried
   * call issuing a duplicate refund.
   */
  refund(paymentId: string, body: RefundPaymentBody, options?: CallOptions) {
    return unwrap(
      this.client.POST("/payments/{payment_id}/refund", {
        params: { path: { payment_id: paymentId } },
        body,
        headers: options?.headers,
      }),
    );
  }
}
