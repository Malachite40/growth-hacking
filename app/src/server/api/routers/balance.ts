import { createTRPCRouter, protectedProcedure } from "../trpc"

export const balancesRouter = createTRPCRouter({
  fetch: protectedProcedure.query(async ({ ctx }) => {
    return { balance: ctx.tokenBalance }
  }),
})
