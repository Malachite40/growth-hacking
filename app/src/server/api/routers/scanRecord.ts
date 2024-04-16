import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const scanRecordsRouter = createTRPCRouter({
  fetchAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const scanRecords = await ctx.db.subredditScanRecord.findMany({
        where: {
          watchedSubreddit: {
            organizationId: ctx.selectedOrganization.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          watchedSubreddit: true,
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: input.limit + 1,
      })

      const totalCount = await ctx.db.subredditScanRecord.count({
        where: {
          watchedSubreddit: {
            organizationId: ctx.selectedOrganization.id,
          },
        },
      })

      let nextCursor: typeof input.cursor | undefined = undefined
      if (scanRecords.length > input.limit) {
        const nextItem = scanRecords.pop()
        nextCursor = nextItem!.id
      }
      return {
        scanRecords,
        totalCount,
        nextCursor,
      }
    }),
})
