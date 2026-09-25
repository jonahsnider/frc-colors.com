/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as colorSubmissions from "../colorSubmissions.js";
import type * as colors from "../colors.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as lib_admin from "../lib/admin.js";
import type * as lib_colors from "../lib/colors.js";
import type * as lib_tba from "../lib/tba.js";
import type * as migrateIds from "../migrateIds.js";
import type * as refresh from "../refresh.js";
import type * as refreshBatch from "../refreshBatch.js";
import type * as teamNames from "../teamNames.js";
import type * as verificationRequests from "../verificationRequests.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  colorSubmissions: typeof colorSubmissions;
  colors: typeof colors;
  crons: typeof crons;
  http: typeof http;
  "lib/admin": typeof lib_admin;
  "lib/colors": typeof lib_colors;
  "lib/tba": typeof lib_tba;
  migrateIds: typeof migrateIds;
  refresh: typeof refresh;
  refreshBatch: typeof refreshBatch;
  teamNames: typeof teamNames;
  verificationRequests: typeof verificationRequests;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
