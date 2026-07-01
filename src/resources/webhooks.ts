import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type CreateWebhookBody = NonNullable<paths["/webhooks"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateWebhookBody =
  NonNullable<paths["/webhooks/{webhook_id}"]["put"]["requestBody"]>["content"]["application/json"];
type AddTriggerBody =
  NonNullable<paths["/webhooks/{webhook_id}/triggers"]["post"]["requestBody"]>["content"]["application/json"];

export class WebhooksResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of webhooks. */
  list() {
    return unwrap(this.client.GET("/webhooks", {}));
  }

  /** Create a new webhook. */
  create(body: CreateWebhookBody) {
    return unwrap(this.client.POST("/webhooks", { body }));
  }

  /** Fetch a single webhook. */
  get(webhookId: string) {
    return unwrap(this.client.GET("/webhooks/{webhook_id}", { params: { path: { webhook_id: webhookId } } }));
  }

  /** Replace a webhook's configuration. */
  update(webhookId: string, body: UpdateWebhookBody) {
    return unwrap(
      this.client.PUT("/webhooks/{webhook_id}", { params: { path: { webhook_id: webhookId } }, body }),
    );
  }

  /** Partially modify a webhook (e.g. enable/disable). */
  modify(webhookId: string) {
    return unwrap(this.client.PATCH("/webhooks/{webhook_id}", { params: { path: { webhook_id: webhookId } } }));
  }

  /** Remove a webhook. */
  remove(webhookId: string) {
    return unwrap(this.client.DELETE("/webhooks/{webhook_id}", { params: { path: { webhook_id: webhookId } } }));
  }

  /** Send a test event to a webhook. */
  test(webhookId: string) {
    return unwrap(this.client.POST("/webhooks/{webhook_id}/test", { params: { path: { webhook_id: webhookId } } }));
  }

  /** Fetch delivery stats for a webhook. */
  getStats(webhookId: string) {
    return unwrap(this.client.GET("/webhooks/{webhook_id}/stats", { params: { path: { webhook_id: webhookId } } }));
  }

  /** Fetch a webhook's signing secret. */
  getSecret(webhookId: string) {
    return unwrap(this.client.GET("/webhooks/{webhook_id}/secret", { params: { path: { webhook_id: webhookId } } }));
  }

  /** Rotate a webhook's signing secret. */
  rotateSecret(webhookId: string) {
    return unwrap(
      this.client.PATCH("/webhooks/{webhook_id}/secret", { params: { path: { webhook_id: webhookId } } }),
    );
  }

  /** Subscribe a webhook to an additional event trigger. */
  addTrigger(webhookId: string, body: AddTriggerBody) {
    return unwrap(
      this.client.POST("/webhooks/{webhook_id}/triggers", { params: { path: { webhook_id: webhookId } }, body }),
    );
  }

  /** Unsubscribe a webhook from an event trigger. */
  removeTrigger(webhookId: string, triggerId: string) {
    return unwrap(
      this.client.DELETE("/webhooks/{webhook_id}/triggers/{trigger_id}", {
        params: { path: { webhook_id: webhookId, trigger_id: triggerId } },
      }),
    );
  }

  /** Fetch delivery events for a webhook. */
  getEvents(webhookId: string) {
    return unwrap(this.client.GET("/webhooks/{webhook_id}/events", { params: { path: { webhook_id: webhookId } } }));
  }

  /** Retry delivery of a specific webhook event. */
  retryEvent(webhookId: string, eventId: string) {
    return unwrap(
      this.client.POST("/webhooks/{webhook_id}/events/{event_id}", {
        params: { path: { webhook_id: webhookId, event_id: eventId } },
      }),
    );
  }
}
