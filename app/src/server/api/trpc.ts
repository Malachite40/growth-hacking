/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { getAuth } from "@clerk/nextjs/server"
import { TRPCError, initTRPC } from "@trpc/server"
import { NextRequest } from "next/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { db } from "~/server/db"

export const createTRPCContext = async (opts: {
  headers: Headers
  req: NextRequest
}) => {
  const auth = getAuth(opts.req)
  console.log({
    auth,
    req: opts.req,
    exp:
      auth &&
      auth.sessionClaims?.exp &&
      new Date(auth.sessionClaims.exp * 1000),
  })

  return {
    db,
    auth,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createCallerFactory = t.createCallerFactory

export const createTRPCRouter = t.router

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const userId = ctx.auth?.userId

  if (!userId)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This action requires you to be signed in.",
    })

  const db_user = await ctx.db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      OrganizationUserRole: {
        include: {
          organization: true,
        },
      },
      UserSettings: true,
    },
  })

  if (!db_user || !db_user.UserSettings)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This action requires you to be signed in.",
    })

  const selectedOrganization = db_user.UserSettings.selectedOrganizationId
    ? db_user.OrganizationUserRole.find(
        (role) =>
          role.organizationId === db_user.UserSettings?.selectedOrganizationId,
      )?.organization
    : db_user.OrganizationUserRole[0]?.organization

  if (!selectedOrganization)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This action requires a default selected organization.",
    })

  return next({
    ctx: {
      user: db_user,
      organizations: db_user.OrganizationUserRole.map(
        (role) => role.organization,
      ),
      roles: db_user.OrganizationUserRole,
      selectedOrganization: selectedOrganization,
      auth: ctx.auth,
    },
  })
})

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
