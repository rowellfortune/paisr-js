import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { components, paths } from "../generated/types.js";

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
   */
  initiate<M extends keyof InitiatePaymentBodyMap>(method: M, body: InitiatePaymentBodyMap[M]) {
    return unwrap(this.client.POST("/payments/initiate/{method}", { params: { path: { method } }, body }));
  }

  /** Fetch a single payment. */
  get(paymentId: string) {
    return unwrap(this.client.GET("/payments/{payment_id}", { params: { path: { payment_id: paymentId } } }));
  }

  /** Refund a payment, in full or in part. */
  refund(paymentId: string, body: RefundPaymentBody) {
    return unwrap(
      this.client.POST("/payments/{payment_id}/refund", { params: { path: { payment_id: paymentId } }, body }),
    );
  }
}
