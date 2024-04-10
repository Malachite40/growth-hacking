import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const watchListRouter = createTRPCRouter({
  createWatchedSubreddit: protectedProcedure
    .input(
      z.object({
        subreddits: z.array(z.object({ value: z.string().min(2) })),
        topic: z.string().min(2),
        title: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const searchConversation = await ctx.db.searchConversation.create({
        data: {
          topic: input.topic,
        },
      })

      const watchedSubreddit = await ctx.db.watchedSubreddit.create({
        data: {
          title: input.title,
          organizationId: ctx.selectedOrganization.id,
          subreddits: {
            createMany: {
              data: input.subreddits.map((subreddit) => ({
                name: subreddit.value,
              })),
            },
          },
          searchConversationId: searchConversation.id,
        },
      })
      return { watchedSubreddit }
    }),

  fetch: protectedProcedure.query(async ({ ctx }) => {
    const watchedSubreddit = await ctx.db.watchedSubreddit.findMany({
      where: {
        organizationId: ctx.selectedOrganization.id,
      },
      include: {
        searchConversation: true,
        subreddits: true,
      },
    })
    return { watchedSubreddit }
  }),

  deleteWatchedSubreddit: protectedProcedure
    .input(
      z.object({
        watchedSubredditId: z.string().uuid(),
        searchConversationId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchedSubreddit.delete({
        where: {
          id: input.watchedSubredditId,
        },
      })
      await ctx.db.searchConversation.delete({
        where: {
          id: input.searchConversationId,
        },
      })
      return { success: true }
    }),

  editWatchedSubreddit: protectedProcedure
    .input(
      z.object({
        watchedSubredditId: z.string().uuid(),
        subreddits: z.array(z.object({ value: z.string().min(2) })),
        topic: z.string().min(2),
        title: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchedSubreddit.update({
        where: {
          id: input.watchedSubredditId,
        },
        data: {
          title: input.title,
          subreddits: {
            deleteMany: {},
            createMany: {
              data: input.subreddits.map((subreddit) => ({
                name: subreddit.value,
              })),
            },
          },
          searchConversation: {
            update: {
              data: {
                topic: input.topic,
              },
            },
          },
        },
      })

      return { success: true }
    }),
})
