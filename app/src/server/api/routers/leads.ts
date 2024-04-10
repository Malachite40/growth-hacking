import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const leadsRouter = createTRPCRouter({
  fetchAll: publicProcedure
    .input(
      z.object({
        goodLead: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const leads = await ctx.db.commentLeadReddit.findMany({
        where: {
          score: {
            gte: 0,
          },
          goodLead: input.goodLead ? input.goodLead : null,
        },
        orderBy: {
          score: "desc",
        },
        include: {
          RedditPost: true,
          WatchedSubreddit: true,
        },
      })

      return { leads }
    }),
  rateLead: protectedProcedure
    .input(
      z.object({ leadId: z.string().uuid(), goodLead: z.boolean().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.db.commentLeadReddit.update({
        where: {
          id: input.leadId,
        },
        data: {
          goodLead: input.goodLead,
        },
      })

      return { lead }
    }),
  undoRating: protectedProcedure
    .input(z.object({ leadId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.commentLeadReddit.update({
        where: {
          id: input.leadId,
        },
        data: {
          goodLead: null,
        },
      })

      return { success: true }
    }),
})
