import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  mutation as mutationRaw,
  query as queryRaw,
} from "./_generated/server";

// TODO: separate the redundant function into authCheck
const queryAuthCheck = customCtx(async (ctx: QueryCtx) => {
  return { db: ctx.db };
});

const mutationAuthCheck = customCtx(async (ctx: MutationCtx) => {
  return { db: ctx.db };
});

export const query = customQuery(queryRaw, queryAuthCheck);
export const mutation = customMutation(mutationRaw, mutationAuthCheck);
// export const action = customAction(actionRaw, authCheck);
