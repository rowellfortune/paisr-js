import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type ListLogsQuery = paths["/logs"]["get"]["parameters"]["query"];

export class LogsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch API request logs, optionally filtered by resource, method, or auth flow. */
  list(query?: ListLogsQuery) {
    return unwrap(this.client.GET("/logs", { params: { query } }));
  }
}
