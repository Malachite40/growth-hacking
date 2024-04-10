import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const leadsRouter = createTRPCRouter({
  fetch: publicProcedure.query(async ({ ctx, input }) => {
    const leads = await ctx.db.commentLeadReddit.findMany({
      where: {
        score: {
          gte: 0,
        },
        goodLead: null,
      },
      orderBy: {
        score: "desc",
      },
      include: {
        RedditPost: true,
      },
    })

    return { leads }
  }),
  rateLead: protectedProcedure
    .input(
      z.object({ leadId: z.string().uuid(), goodLead: z.boolean().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.commentLeadReddit.update({
        where: {
          id: input.leadId,
        },
        data: {
          goodLead: input.goodLead,
        },
      })

      return { success: true }
    }),
})
