import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"

export const potentialLeadsRouter = createTRPCRouter({
  fetch: publicProcedure
    .input(z.object({ watchedSubredditId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const leads = await ctx.db.potentialThreadReddit.findMany({
        where: {
          watchedSubredditId: input.watchedSubredditId,
        },
        orderBy: {
          score: "desc",
        },
      })

      return { leads }
    }),
})
