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

  fetchAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const watchedSubreddit = await ctx.db.watchedSubreddit.findMany({
        where: {
          organizationId: ctx.selectedOrganization.id,
          deletedAt: null,
        },
        include: {
          searchConversation: true,
          subreddits: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: input.limit + 1,
      })

      const totalCount = await ctx.db.watchedSubreddit.count({
        where: {
          organizationId: ctx.selectedOrganization.id,
        },
      })

      let nextCursor: typeof input.cursor | undefined = undefined
      if (watchedSubreddit.length > input.limit) {
        const nextItem = watchedSubreddit.pop()
        nextCursor = nextItem!.id
      }
      return { watchedSubreddit, nextCursor, totalCount }
    }),

  deleteWatchedSubreddit: protectedProcedure
    .input(
      z.object({
        watchedSubredditId: z.string().uuid(),
        searchConversationId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchedSubreddit.update({
        where: {
          id: input.watchedSubredditId,
        },
        data: {
          deletedAt: new Date(),
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
