import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const leadsRouter = createTRPCRouter({
  fetchAll: protectedProcedure
    .input(
      z.object({
        rating: z.number().optional().default(0),
        goodLead: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const leads = await ctx.db.commentLeadReddit.findMany({
        where: {
          WatchedSubreddit: {
            organizationId: ctx.selectedOrganization.id,
          },
          score: {
            gte: input.rating,
          },
          goodLead: input.goodLead ? input.goodLead : null,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          RedditPost: true,
          WatchedSubreddit: true,
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: input.limit + 1,
      })

      const totalCount = await ctx.db.commentLeadReddit.count({
        where: {
          WatchedSubreddit: {
            organizationId: ctx.selectedOrganization.id,
          },
          score: {
            gte: input.rating,
          },
          goodLead: input.goodLead ? input.goodLead : null,
        },
      })

      let nextCursor: typeof input.cursor | undefined = undefined
      if (leads.length > input.limit) {
        const nextItem = leads.pop()
        nextCursor = nextItem!.id
      }

      return { leads, nextCursor, totalCount }
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
          seenAt: new Date(),
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
  fetchUnseenCount: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const count = await ctx.db.commentLeadReddit.count({
        where: {
          WatchedSubreddit: {
            organizationId: ctx.selectedOrganization.id,
          },
          goodLead: null,
        },
      })

      return { count }
    }),
})
