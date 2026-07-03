import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type ListInvoicesQuery = paths["/invoices"]["get"]["parameters"]["query"];
type CreateInvoiceBody = NonNullable<paths["/invoices"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateInvoiceBody =
  NonNullable<paths["/invoices/{invoice_id}"]["put"]["requestBody"]>["content"]["application/json"];
type AddLineItemsBody =
  NonNullable<paths["/invoices/{invoice_id}/items"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateLineItemBody =
  NonNullable<paths["/invoices/{invoice_id}/items/{item_id}"]["put"]["requestBody"]>["content"]["application/json"];

class InvoiceLineItemsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Add line items to an invoice. */
  add(invoiceId: string, body: AddLineItemsBody) {
    return unwrap(this.client.POST("/invoices/{invoice_id}/items", { params: { path: { invoice_id: invoiceId } }, body }));
  }

  /** Update a single line item on an invoice. */
  update(invoiceId: string, itemId: string, body: UpdateLineItemBody) {
    return unwrap(
      this.client.PUT("/invoices/{invoice_id}/items/{item_id}", {
        params: { path: { invoice_id: invoiceId, item_id: itemId } },
        body,
      }),
    );
  }

  /** Remove a line item from an invoice. */
  remove(invoiceId: string, itemId: string) {
    return unwrap(
      this.client.DELETE("/invoices/{invoice_id}/items/{item_id}", {
        params: { path: { invoice_id: invoiceId, item_id: itemId } },
      }),
    );
  }
}

export class InvoicesResource {
  readonly line_items: InvoiceLineItemsResource;

  constructor(private readonly client: PaisrClient) {
    this.line_items = new InvoiceLineItemsResource(client);
  }

  /** Fetch a list of invoices, optionally filtered by resource, currency, or status. */
  list(query?: ListInvoicesQuery) {
    return unwrap(this.client.GET("/invoices", { params: { query } }));
  }

  /** Create a new invoice. */
  create(body: CreateInvoiceBody) {
    return unwrap(this.client.POST("/invoices", { body }));
  }

  /** Fetch a single invoice. */
  get(invoiceId: string) {
    return unwrap(this.client.GET("/invoices/{invoice_id}", { params: { path: { invoice_id: invoiceId } } }));
  }

  /** Update an invoice. */
  update(invoiceId: string, body: UpdateInvoiceBody) {
    return unwrap(
      this.client.PUT("/invoices/{invoice_id}", { params: { path: { invoice_id: invoiceId } }, body }),
    );
  }

  /** Remove an invoice. */
  remove(invoiceId: string) {
    return unwrap(this.client.DELETE("/invoices/{invoice_id}", { params: { path: { invoice_id: invoiceId } } }));
  }

  /** Send an invoice to the customer. */
  send(invoiceId: string) {
    return unwrap(this.client.POST("/invoices/{invoice_id}/send", { params: { path: { invoice_id: invoiceId } } }));
  }
}
