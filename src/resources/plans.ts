import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type ListPlansQuery = paths["/plans"]["get"]["parameters"]["query"];
type GetPlanQuery = paths["/plans/{plan_id}"]["get"]["parameters"]["query"];
type CreatePlanBody = NonNullable<paths["/plans"]["post"]["requestBody"]>["content"]["application/json"];
type UpdatePlanBody = NonNullable<paths["/plans/{plan_id}"]["put"]["requestBody"]>["content"]["application/json"];
type AddPriceOptionBody =
  NonNullable<paths["/plans/{plan_id}/options"]["post"]["requestBody"]>["content"]["application/json"];
type UpdatePriceOptionBody =
  NonNullable<paths["/plans/{plan_id}/options/{option_id}"]["put"]["requestBody"]>["content"]["application/json"];

class PlanOptionsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Add a price option to a plan. */
  add(planId: string, body: AddPriceOptionBody) {
    return unwrap(this.client.POST("/plans/{plan_id}/options", { params: { path: { plan_id: planId } }, body }));
  }

  /** Replace a price option on a plan. */
  update(planId: string, optionId: string, body: UpdatePriceOptionBody) {
    return unwrap(
      this.client.PUT("/plans/{plan_id}/options/{option_id}", {
        params: { path: { plan_id: planId, option_id: optionId } },
        body,
      }),
    );
  }

  /** Partially modify a price option on a plan. */
  modify(planId: string, optionId: string) {
    return unwrap(
      this.client.PATCH("/plans/{plan_id}/options/{option_id}", {
        params: { path: { plan_id: planId, option_id: optionId } },
      }),
    );
  }

  /** Remove a price option from a plan. */
  remove(planId: string, optionId: string) {
    return unwrap(
      this.client.DELETE("/plans/{plan_id}/options/{option_id}", {
        params: { path: { plan_id: planId, option_id: optionId } },
      }),
    );
  }
}

export class PlansResource {
  readonly options: PlanOptionsResource;

  constructor(private readonly client: PaisrClient) {
    this.options = new PlanOptionsResource(client);
  }

  /** Fetch a list of plans, optionally filtered by type, currency, or active state. */
  list(query?: ListPlansQuery) {
    return unwrap(this.client.GET("/plans", { params: { query } }));
  }

  /** Create a new plan. */
  create(body: CreatePlanBody) {
    return unwrap(this.client.POST("/plans", { body }));
  }

  /** Fetch a single plan. */
  get(planId: string, query?: GetPlanQuery) {
    return unwrap(this.client.GET("/plans/{plan_id}", { params: { path: { plan_id: planId }, query } }));
  }

  /** Update a plan. */
  update(planId: string, body: UpdatePlanBody) {
    return unwrap(this.client.PUT("/plans/{plan_id}", { params: { path: { plan_id: planId } }, body }));
  }

  /** Remove a plan. */
  remove(planId: string) {
    return unwrap(this.client.DELETE("/plans/{plan_id}", { params: { path: { plan_id: planId } } }));
  }
}
