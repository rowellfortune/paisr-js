import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type CreateWalletBody = NonNullable<paths["/wallets"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateProfileBody = NonNullable<paths["/wallets/{wallet_id}"]["put"]["requestBody"]>["content"]["application/json"];
type UpdateWalletBody = NonNullable<paths["/wallets/{wallet_id}"]["patch"]["requestBody"]>["content"]["application/json"];
type TransactionsQuery = paths["/wallets/{wallet_id}/transactions"]["get"]["parameters"]["query"];
type BalancesQuery = paths["/wallets/{wallet_id}/balances"]["get"]["parameters"]["query"];
type OpenBalanceBody =
  NonNullable<paths["/wallets/{wallet_id}/balances"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateBalanceBody =
  NonNullable<paths["/wallets/{wallet_id}/balances/{balance_id}"]["put"]["requestBody"]>["content"]["application/json"];
type ConnectAccountBody =
  NonNullable<paths["/wallets/{wallet_id}/accounts"]["post"]["requestBody"]>["content"]["application/json"];
type VerifyAccountBody =
  NonNullable<paths["/wallets/{wallet_id}/accounts/{account_id}"]["patch"]["requestBody"]>["content"]["application/json"];
type AddContactBody =
  NonNullable<paths["/wallets/{wallet_id}/contacts"]["post"]["requestBody"]>["content"]["application/json"];
type CreateLinkBody = NonNullable<paths["/wallets/{wallet_id}/links"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateLinkBody =
  NonNullable<paths["/wallets/{wallet_id}/links/{link_id}"]["put"]["requestBody"]>["content"]["application/json"];

class WalletPinResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a wallet's PIN state (never the raw PIN itself). */
  get(walletId: string) {
    return unwrap(this.client.GET("/wallets/{wallet_id}/pin", { params: { path: { wallet_id: walletId } } }));
  }

  /** Rotate a wallet's PIN. */
  rotate(walletId: string) {
    return unwrap(this.client.PATCH("/wallets/{wallet_id}/pin", { params: { path: { wallet_id: walletId } } }));
  }
}

class WalletStatementsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a wallet's statements. */
  list(walletId: string) {
    return unwrap(this.client.GET("/wallets/{wallet_id}/statements", { params: { path: { wallet_id: walletId } } }));
  }
}

class WalletTransactionsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a wallet's transactions, optionally filtered by balance, status, type, or method. */
  list(walletId: string, query?: TransactionsQuery) {
    return unwrap(
      this.client.GET("/wallets/{wallet_id}/transactions", { params: { path: { wallet_id: walletId }, query } }),
    );
  }

  /** Fetch a single transaction on a wallet. */
  get(walletId: string, transactionId: string) {
    return unwrap(
      this.client.GET("/wallets/{wallet_id}/transactions/{transaction_id}", {
        params: { path: { wallet_id: walletId, transaction_id: transactionId } },
      }),
    );
  }
}

class WalletBalancesResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a wallet's balances, optionally filtered by type or currency. */
  list(walletId: string, query?: BalancesQuery) {
    return unwrap(
      this.client.GET("/wallets/{wallet_id}/balances", { params: { path: { wallet_id: walletId }, query } }),
    );
  }

  /** Open a new balance on a wallet. */
  open(walletId: string, body: OpenBalanceBody) {
    return unwrap(
      this.client.POST("/wallets/{wallet_id}/balances", { params: { path: { wallet_id: walletId } }, body }),
    );
  }

  /** Fetch a single balance on a wallet. */
  get(walletId: string, balanceId: string) {
    return unwrap(
      this.client.GET("/wallets/{wallet_id}/balances/{balance_id}", {
        params: { path: { wallet_id: walletId, balance_id: balanceId } },
      }),
    );
  }

  /** Update a balance on a wallet. */
  update(walletId: string, balanceId: string, body: UpdateBalanceBody) {
    return unwrap(
      this.client.PUT("/wallets/{wallet_id}/balances/{balance_id}", {
        params: { path: { wallet_id: walletId, balance_id: balanceId } },
        body,
      }),
    );
  }

  /** Close a balance on a wallet. */
  close(walletId: string, balanceId: string) {
    return unwrap(
      this.client.DELETE("/wallets/{wallet_id}/balances/{balance_id}", {
        params: { path: { wallet_id: walletId, balance_id: balanceId } },
      }),
    );
  }
}

class WalletAccountsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a wallet's linked external accounts. */
  list(walletId: string) {
    return unwrap(this.client.GET("/wallets/{wallet_id}/accounts", { params: { path: { wallet_id: walletId } } }));
  }

  /** Connect a new external account to a wallet. */
  connect(walletId: string, body: ConnectAccountBody) {
    return unwrap(
      this.client.POST("/wallets/{wallet_id}/accounts", { params: { path: { wallet_id: walletId } }, body }),
    );
  }

  /** Fetch a single linked account. */
  get(walletId: string, accountId: string) {
    return unwrap(
      this.client.GET("/wallets/{wallet_id}/accounts/{account_id}", {
        params: { path: { wallet_id: walletId, account_id: accountId } },
      }),
    );
  }

  /** Verify a linked account (e.g. micro-deposit confirmation). */
  verify(walletId: string, accountId: string, body: VerifyAccountBody) {
    return unwrap(
      this.client.PATCH("/wallets/{wallet_id}/accounts/{account_id}", {
        params: { path: { wallet_id: walletId, account_id: accountId } },
        body,
      }),
    );
  }

  /** Remove a linked account from a wallet. */
  remove(walletId: string, accountId: string) {
    return unwrap(
      this.client.DELETE("/wallets/{wallet_id}/accounts/{account_id}", {
        params: { path: { wallet_id: walletId, account_id: accountId } },
      }),
    );
  }
}

class WalletContactsResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a wallet's saved payment contacts. */
  list(walletId: string) {
    return unwrap(this.client.GET("/wallets/{wallet_id}/contacts", { params: { path: { wallet_id: walletId } } }));
  }

  /** Add a payment contact to a wallet. */
  add(walletId: string, body: AddContactBody) {
    return unwrap(
      this.client.POST("/wallets/{wallet_id}/contacts", { params: { path: { wallet_id: walletId } }, body }),
    );
  }

  /** Fetch a single payment contact. */
  get(walletId: string, contactId: string) {
    return unwrap(
      this.client.GET("/wallets/{wallet_id}/contacts/{contact_id}", {
        params: { path: { wallet_id: walletId, contact_id: contactId } },
      }),
    );
  }

  /** Remove a payment contact from a wallet. */
  remove(walletId: string, contactId: string) {
    return unwrap(
      this.client.DELETE("/wallets/{wallet_id}/contacts/{contact_id}", {
        params: { path: { wallet_id: walletId, contact_id: contactId } },
      }),
    );
  }
}

class WalletLinksResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a wallet's hosted links (e.g. onboarding or top-up links). */
  list(walletId: string) {
    return unwrap(this.client.GET("/wallets/{wallet_id}/links", { params: { path: { wallet_id: walletId } } }));
  }

  /** Create a new hosted link for a wallet. */
  create(walletId: string, body: CreateLinkBody) {
    return unwrap(this.client.POST("/wallets/{wallet_id}/links", { params: { path: { wallet_id: walletId } }, body }));
  }

  /** Fetch a single hosted link. */
  get(walletId: string, linkId: string) {
    return unwrap(
      this.client.GET("/wallets/{wallet_id}/links/{link_id}", {
        params: { path: { wallet_id: walletId, link_id: linkId } },
      }),
    );
  }

  /** Update a hosted link. */
  update(walletId: string, linkId: string, body: UpdateLinkBody) {
    return unwrap(
      this.client.PUT("/wallets/{wallet_id}/links/{link_id}", {
        params: { path: { wallet_id: walletId, link_id: linkId } },
        body,
      }),
    );
  }

  /** Remove a hosted link. */
  remove(walletId: string, linkId: string) {
    return unwrap(
      this.client.DELETE("/wallets/{wallet_id}/links/{link_id}", {
        params: { path: { wallet_id: walletId, link_id: linkId } },
      }),
    );
  }
}

export class WalletsResource {
  readonly pin: WalletPinResource;
  readonly statements: WalletStatementsResource;
  readonly transactions: WalletTransactionsResource;
  readonly balances: WalletBalancesResource;
  readonly accounts: WalletAccountsResource;
  readonly contacts: WalletContactsResource;
  readonly links: WalletLinksResource;

  constructor(private readonly client: PaisrClient) {
    this.pin = new WalletPinResource(client);
    this.statements = new WalletStatementsResource(client);
    this.transactions = new WalletTransactionsResource(client);
    this.balances = new WalletBalancesResource(client);
    this.accounts = new WalletAccountsResource(client);
    this.contacts = new WalletContactsResource(client);
    this.links = new WalletLinksResource(client);
  }

  /** Fetch a list of wallets. */
  list() {
    return unwrap(this.client.GET("/wallets", {}));
  }

  /** Create a new wallet. */
  create(body: CreateWalletBody) {
    return unwrap(this.client.POST("/wallets", { body }));
  }

  /** Fetch a single wallet. */
  get(walletId: string) {
    return unwrap(this.client.GET("/wallets/{wallet_id}", { params: { path: { wallet_id: walletId } } }));
  }

  /** Update a wallet's profile details. */
  updateProfile(walletId: string, body: UpdateProfileBody) {
    return unwrap(this.client.PUT("/wallets/{wallet_id}", { params: { path: { wallet_id: walletId } }, body }));
  }

  /** Partially update a wallet. */
  update(walletId: string, body: UpdateWalletBody) {
    return unwrap(this.client.PATCH("/wallets/{wallet_id}", { params: { path: { wallet_id: walletId } }, body }));
  }

  /** Delete a wallet. */
  delete(walletId: string) {
    return unwrap(this.client.DELETE("/wallets/{wallet_id}", { params: { path: { wallet_id: walletId } } }));
  }
}
