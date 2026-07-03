import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

/** Options for a single request, e.g. an idempotency key to guard against duplicate execution on retry. */
interface CallOptions {
  headers?: Record<string, string>;
}

type InitiateTransferMethod = paths["/transfers/initiate/{method}"]["post"]["parameters"]["path"]["method"];
type InitiateTransferBody =
  NonNullable<paths["/transfers/initiate/{method}"]["post"]["requestBody"]>["content"]["application/json"];
type BatchTransferBody =
  NonNullable<paths["/transfers/initiate/batch"]["post"]["requestBody"]>["content"]["application/json"];
type ApproveTransferBody =
  NonNullable<paths["/transfers/{transaction_id}/approve"]["post"]["requestBody"]>["content"]["application/json"];
type CancelTransferBody =
  NonNullable<paths["/transfers/{transaction_id}/cancel"]["post"]["requestBody"]>["content"]["application/json"];

export class TransfersResource {
  constructor(private readonly client: PaisrClient) {}

  /**
   * Initiate a transfer using the given method ("peer", "move", or "bank").
   *
   * Pass `options.headers` (e.g. `{ "Idempotency-Key": ... }`) to guard against a retried
   * call initiating a duplicate transfer.
   */
  initiate(method: InitiateTransferMethod, body: InitiateTransferBody, options?: CallOptions) {
    return unwrap(
      this.client.POST("/transfers/initiate/{method}", {
        params: { path: { method } },
        body,
        headers: options?.headers,
      }),
    );
  }

  /** Initiate a batch of transfers in a single request. */
  initiateBatch(body: BatchTransferBody, options?: CallOptions) {
    return unwrap(this.client.POST("/transfers/initiate/batch", { body, headers: options?.headers }));
  }

  /** Approve a pending transfer. */
  approve(transactionId: string, body: ApproveTransferBody, options?: CallOptions) {
    return unwrap(
      this.client.POST("/transfers/{transaction_id}/approve", {
        params: { path: { transaction_id: transactionId } },
        body,
        headers: options?.headers,
      }),
    );
  }

  /** Cancel a pending transfer. */
  cancel(transactionId: string, body: CancelTransferBody) {
    return unwrap(
      this.client.POST("/transfers/{transaction_id}/cancel", {
        params: { path: { transaction_id: transactionId } },
        body,
      }),
    );
  }
}
