import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type ListPaymentsQuery = paths["/payments"]["get"]["parameters"]["query"];
type InitiatePaymentMethod = paths["/payments/initiate/{method}"]["post"]["parameters"]["path"]["method"];
type InitiatePaymentBody =
  NonNullable<paths["/payments/initiate/{method}"]["post"]["requestBody"]>["content"]["application/json"];
type RefundPaymentBody =
  NonNullable<paths["/payments/{payment_id}/refund"]["post"]["requestBody"]>["content"]["application/json"];

export class PaymentsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of payments, optionally filtered by resource, currency, status, or method. */
  list(query?: ListPaymentsQuery) {
    return unwrap(this.client.GET("/payments", { params: { query } }));
  }

  /** Initiate a payment using the given method ("bank", "wallet", "qr", or "card"). */
  initiate(method: InitiatePaymentMethod, body: InitiatePaymentBody) {
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
