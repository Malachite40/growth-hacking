import { RoleType } from "@prisma/client"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(2) }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.create({
        data: {
          name: input.name,
          ownerId: ctx.user.id,
          OrganizationUserRoles: {
            create: {
              role: RoleType.OWNER,
              userId: ctx.user.id,
            },
          },
        },
      })

      const updated_settings = await ctx.db.userSettings.update({
        where: {
          userId: ctx.user.id,
        },
        data: {
          selectedOrganizationId: organization.id,
        },
      })

      return { organization }
    }),
  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    const organizations = await ctx.db.organization.findMany({
      where: {
        OrganizationUserRoles: {
          some: {
            userId: ctx.user.id,
          },
        },
      },
    })

    return { organizations }
  }),
})
