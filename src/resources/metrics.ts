import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";

export class MetricsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch invoice metrics. */
  invoices() {
    return unwrap(this.client.GET("/metrics/invoices", {}));
  }

  /** Fetch subscription metrics. */
  subscriptions() {
    return unwrap(this.client.GET("/metrics/subscriptions", {}));
  }

  /** Fetch payment metrics. */
  payments() {
    return unwrap(this.client.GET("/metrics/payments", {}));
  }

  /** Fetch customer metrics. */
  customers() {
    return unwrap(this.client.GET("/metrics/customers", {}));
  }
}
