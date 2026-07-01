import type { PaisrClient } from "../client.js";
import { unwrap } from "../client.js";
import type { paths } from "../generated/types.js";

type CreateTokenBody = NonNullable<paths["/access-tokens"]["post"]["requestBody"]>["content"]["application/json"];
type UpdateTokenBody = NonNullable<paths["/access-tokens/{token_id}"]["put"]["requestBody"]>["content"]["application/json"];
type AddPermissionBody =
  NonNullable<paths["/access-tokens/{token_id}/permissions"]["post"]["requestBody"]>["content"]["application/json"];

export class AccessTokensResource {
  constructor(private readonly client: PaisrClient) {}

  /** Fetch a list of access tokens. */
  list() {
    return unwrap(this.client.GET("/access-tokens", {}));
  }

  /** Create a new access token. */
  create(body: CreateTokenBody) {
    return unwrap(this.client.POST("/access-tokens", { body }));
  }

  /** Fetch a single access token. */
  get(tokenId: string) {
    return unwrap(this.client.GET("/access-tokens/{token_id}", { params: { path: { token_id: tokenId } } }));
  }

  /** Update an access token. */
  update(tokenId: string, body: UpdateTokenBody) {
    return unwrap(this.client.PUT("/access-tokens/{token_id}", { params: { path: { token_id: tokenId } }, body }));
  }

  /** Revoke an access token. */
  revoke(tokenId: string) {
    return unwrap(this.client.DELETE("/access-tokens/{token_id}", { params: { path: { token_id: tokenId } } }));
  }

  /** Add a permission scope to an access token. */
  addPermission(tokenId: string, body: AddPermissionBody) {
    return unwrap(
      this.client.POST("/access-tokens/{token_id}/permissions", { params: { path: { token_id: tokenId } }, body }),
    );
  }

  /** Remove a permission scope from an access token. */
  removePermission(tokenId: string, permissionId: string) {
    return unwrap(
      this.client.DELETE("/access-tokens/{token_id}/permissions/{permission_id}", {
        params: { path: { token_id: tokenId, permission_id: permissionId } },
      }),
    );
  }
}
