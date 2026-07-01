import { createPaisrClient, type PaisrClient, type PaisrOptions } from "./client.js";
import { AccessTokensResource } from "./resources/access-tokens.js";
import { WebhooksResource } from "./resources/webhooks.js";
import { WalletsResource } from "./resources/wallets.js";
import { TransfersResource } from "./resources/transfers.js";
import { CustomersResource } from "./resources/customers.js";
import { VouchersResource } from "./resources/vouchers.js";
import { PlansResource } from "./resources/plans.js";
import { InvoicesResource } from "./resources/invoices.js";
import { SubscriptionsResource } from "./resources/subscriptions.js";
import { PaymentsResource } from "./resources/payments.js";
import { ProvidersResource } from "./resources/providers.js";
import { MetricsResource } from "./resources/metrics.js";
import { LogsResource } from "./resources/logs.js";

export { PaisrError } from "./client.js";
export type { PaisrOptions, PaisrEnvironment, PaisrClient } from "./client.js";
export type { paths, components } from "./generated/types.js";
export { verifyWebhookSignature, constructWebhookEvent } from "./webhook-signature.js";
export type { VerifyWebhookSignatureOptions } from "./webhook-signature.js";

/**
 * Client for the Paisr API (https://github.com/paisrtechnologies/pcb-openapi).
 *
 * @example
 * ```ts
 * const paisr = new Paisr({ apiKey: process.env.PAISR_API_KEY! });
 * const { wallets } = await paisr.wallets.list();
 * const wallet = await paisr.wallets.get(wallets[0].id);
 * ```
 */
export class Paisr {
  readonly client: PaisrClient;

  readonly accessTokens: AccessTokensResource;
  readonly webhooks: WebhooksResource;
  readonly wallets: WalletsResource;
  readonly transfers: TransfersResource;
  readonly customers: CustomersResource;
  readonly vouchers: VouchersResource;
  readonly plans: PlansResource;
  readonly invoices: InvoicesResource;
  readonly subscriptions: SubscriptionsResource;
  readonly payments: PaymentsResource;
  readonly providers: ProvidersResource;
  readonly metrics: MetricsResource;
  readonly logs: LogsResource;

  constructor(options: PaisrOptions) {
    this.client = createPaisrClient(options);

    this.accessTokens = new AccessTokensResource(this.client);
    this.webhooks = new WebhooksResource(this.client);
    this.wallets = new WalletsResource(this.client);
    this.transfers = new TransfersResource(this.client);
    this.customers = new CustomersResource(this.client);
    this.vouchers = new VouchersResource(this.client);
    this.plans = new PlansResource(this.client);
    this.invoices = new InvoicesResource(this.client);
    this.subscriptions = new SubscriptionsResource(this.client);
    this.payments = new PaymentsResource(this.client);
    this.providers = new ProvidersResource(this.client);
    this.metrics = new MetricsResource(this.client);
    this.logs = new LogsResource(this.client);
  }
}

export default Paisr;
