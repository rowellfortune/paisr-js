import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type AddCustomerBody = NonNullable<paths["/customers"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateCustomerBody =
  NonNullable<paths["/customers/{customer_id}"]["put"]["requestBody"]>["content"]["application/json"];

export class CustomersResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of customers. */
  list() {
    return unwrap(this.client.GET("/customers", {}));
  }

  /** Add a new customer. */
  add(body: AddCustomerBody) {
    return unwrap(this.client.POST("/customers", { body }));
  }

  /** Fetch a single customer. */
  get(customerId: string) {
    return unwrap(this.client.GET("/customers/{customer_id}", { params: { path: { customer_id: customerId } } }));
  }

  /** Update a customer. */
  update(customerId: string, body: UpdateCustomerBody) {
    return unwrap(
      this.client.PUT("/customers/{customer_id}", { params: { path: { customer_id: customerId } }, body }),
    );
  }

  /** Restore a previously removed customer. */
  restore(customerId: string) {
    return unwrap(this.client.PATCH("/customers/{customer_id}", { params: { path: { customer_id: customerId } } }));
  }

  /** Remove a customer. */
  remove(customerId: string) {
    return unwrap(this.client.DELETE("/customers/{customer_id}", { params: { path: { customer_id: customerId } } }));
  }
}
