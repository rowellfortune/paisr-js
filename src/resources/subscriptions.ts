import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type ListSubscriptionsQuery = paths["/subscriptions"]["get"]["parameters"]["query"];
type CreateSubscriptionBody =
  NonNullable<paths["/subscriptions"]["post"]["requestBody"]>["content"]["application/json"];

export class SubscriptionsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of subscriptions, optionally filtered by resource, currency, or status. */
  list(query?: ListSubscriptionsQuery) {
    return unwrap(this.client.GET("/subscriptions", { params: { query } }));
  }

  /** Create a new subscription. */
  create(body: CreateSubscriptionBody) {
    return unwrap(this.client.POST("/subscriptions", { body }));
  }

  /** Fetch a single subscription. */
  get(subscriptionId: string) {
    return unwrap(
      this.client.GET("/subscriptions/{subscription_id}", { params: { path: { subscription_id: subscriptionId } } }),
    );
  }

  /** Update a subscription (e.g. change plan or price option). */
  update(subscriptionId: string) {
    return unwrap(
      this.client.PATCH("/subscriptions/{subscription_id}", {
        params: { path: { subscription_id: subscriptionId } },
      }),
    );
  }

  /** Remove a subscription. */
  remove(subscriptionId: string) {
    return unwrap(
      this.client.DELETE("/subscriptions/{subscription_id}", {
        params: { path: { subscription_id: subscriptionId } },
      }),
    );
  }

  /** Restore a previously canceled subscription. */
  restore(subscriptionId: string) {
    return unwrap(
      this.client.POST("/subscriptions/{subscription_id}/restore", {
        params: { path: { subscription_id: subscriptionId } },
      }),
    );
  }

  /** Cancel a subscription. */
  cancel(subscriptionId: string) {
    return unwrap(
      this.client.POST("/subscriptions/{subscription_id}/cancel", {
        params: { path: { subscription_id: subscriptionId } },
      }),
    );
  }
}
