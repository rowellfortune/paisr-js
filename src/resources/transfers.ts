import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

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

  /** Initiate a transfer using the given method ("peer", "move", or "bank"). */
  initiate(method: InitiateTransferMethod, body: InitiateTransferBody) {
    return unwrap(this.client.POST("/transfers/initiate/{method}", { params: { path: { method } }, body }));
  }

  /** Initiate a batch of transfers in a single request. */
  initiateBatch(body: BatchTransferBody) {
    return unwrap(this.client.POST("/transfers/initiate/batch", { body }));
  }

  /** Approve a pending transfer. */
  approve(transactionId: string, body: ApproveTransferBody) {
    return unwrap(
      this.client.POST("/transfers/{transaction_id}/approve", {
        params: { path: { transaction_id: transactionId } },
        body,
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
