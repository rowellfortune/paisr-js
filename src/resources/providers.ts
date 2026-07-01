import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type ConnectProviderBody = NonNullable<paths["/providers"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateProviderConnectionBody =
  NonNullable<paths["/providers/{connection_id}"]["put"]["requestBody"]>["content"]["application/json"];

export class ProvidersResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of provider connections. */
  list() {
    return unwrap(this.client.GET("/providers", {}));
  }

  /** Connect a new provider. */
  connect(body: ConnectProviderBody) {
    return unwrap(this.client.POST("/providers", { body }));
  }

  /** Replace a provider connection's configuration. */
  update(connectionId: string, body: UpdateProviderConnectionBody) {
    return unwrap(
      this.client.PUT("/providers/{connection_id}", { params: { path: { connection_id: connectionId } }, body }),
    );
  }

  /** Partially modify a provider connection. */
  modify(connectionId: string) {
    return unwrap(this.client.PATCH("/providers/{connection_id}", { params: { path: { connection_id: connectionId } } }));
  }

  /** Remove a provider connection. */
  remove(connectionId: string) {
    return unwrap(
      this.client.DELETE("/providers/{connection_id}", { params: { path: { connection_id: connectionId } } }),
    );
  }
}
