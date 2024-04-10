import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const settingsRouter = createTRPCRouter({
  fetch: protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.db.userSettings.findUnique({
      where: {
        userId: ctx.user.id,
      },
      include: {
        selectedOrganization: true,
      },
    })
    return { settings, organization: settings?.selectedOrganization }
  }),
  setDefaultOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updated_settings = await ctx.db.userSettings.update({
        where: {
          userId: ctx.user.id,
        },
        data: {
          selectedOrganizationId: input.organizationId,
        },
      })

      return { settings: updated_settings }
    }),
})
