import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type CreateVoucherBody = NonNullable<paths["/vouchers"]["post"]["requestBody"]>["content"]["application/json"];
type ApplyVoucherBody = NonNullable<paths["/vouchers/apply"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateVoucherBody =
  NonNullable<paths["/vouchers/{voucher_id}"]["put"]["requestBody"]>["content"]["application/json"];

export class VouchersResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of vouchers. */
  list() {
    return unwrap(this.client.GET("/vouchers", {}));
  }

  /** Create a new voucher. */
  create(body: CreateVoucherBody) {
    return unwrap(this.client.POST("/vouchers", { body }));
  }

  /** Apply a voucher code to a resource (e.g. an invoice or subscription). */
  apply(body: ApplyVoucherBody) {
    return unwrap(this.client.POST("/vouchers/apply", { body }));
  }

  /** Fetch a single voucher. */
  get(voucherId: string) {
    return unwrap(this.client.GET("/vouchers/{voucher_id}", { params: { path: { voucher_id: voucherId } } }));
  }

  /** Update a voucher. */
  update(voucherId: string, body: UpdateVoucherBody) {
    return unwrap(
      this.client.PUT("/vouchers/{voucher_id}", { params: { path: { voucher_id: voucherId } }, body }),
    );
  }

  /** Remove a voucher. */
  remove(voucherId: string) {
    return unwrap(this.client.DELETE("/vouchers/{voucher_id}", { params: { path: { voucher_id: voucherId } } }));
  }
}
