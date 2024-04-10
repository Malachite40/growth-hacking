import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const watchListRouter = createTRPCRouter({
  createWatchedSubreddit: protectedProcedure
    .input(
      z.object({
        subreddits: z.array(z.object({ value: z.string().min(2) })),
        products: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const productList = await ctx.db.productList.create({
        data: {
          products: input.products,
          // include other necessary fields to create a productList
        },
      })

      const watchedSubreddit = await ctx.db.watchedSubreddit.create({
        data: {
          organizationId: ctx.selectedOrganization.id,
          subreddits: {
            createMany: {
              data: input.subreddits.map((subreddit) => ({
                name: subreddit.value,
              })),
            },
          },
          productListId: productList.id,
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
        productList: true,
        subreddits: true,
      },
    })
    return { watchedSubreddit }
  }),

  deleteWatchedSubreddit: publicProcedure
    .input(
      z.object({
        watchedSubredditId: z.string().uuid(),
        productListId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchedSubreddit.delete({
        where: {
          id: input.watchedSubredditId,
        },
      })
      await ctx.db.productList.delete({
        where: {
          id: input.productListId,
        },
      })
      return { success: true }
    }),

  editWatchedSubreddit: publicProcedure
    .input(
      z.object({
        watchedSubredditId: z.string().uuid(),
        subreddits: z.array(z.object({ value: z.string().min(2) })),
        products: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.watchedSubreddit.update({
        where: {
          id: input.watchedSubredditId,
        },
        data: {
          subreddits: {
            deleteMany: {},
            createMany: {
              data: input.subreddits.map((subreddit) => ({
                name: subreddit.value,
              })),
            },
          },
          productList: {
            update: {
              data: {
                products: input.products,
              },
            },
          },
        },
      })

      return { success: true }
    }),
})
